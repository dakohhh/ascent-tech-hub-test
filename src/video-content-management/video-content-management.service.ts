import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AwsService } from "src/aws/aws.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./schemas/movie";
import { APIFeatures } from "../common/utils/api-features";
import { AlgoliaService } from "src/algolia/algolia.service";

@Injectable()
export class VideoContentManagementService {
  private readonly logger = new Logger(VideoContentManagementService.name);
  constructor(
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    private readonly algoliaService: AlgoliaService,
    @InjectModel(Movie.name) private movieModel: Model<Movie>
  ) {}

  async createMovie(createMovieDto: CreateMovieDto, user): Promise<Movie> {
    // i know this would take wisdom a lot b4 he understands but no issue am pro dev
    const dataToUpload: Record<string, any> = { ...createMovieDto };

    const filesToUpload = [
      { file: "file", folder: "movies" },
      { file: "thumb_nail", folder: "thumb_nails" },
    ];

    for (const { file, folder } of filesToUpload) {
      if (createMovieDto[file]) {
        dataToUpload[`${file === "file" ? "movie_url" : "thumb_nail"}`] = await this.awsService.uploadFileToS3({
          file: createMovieDto[file],
          folder: folder,
          ACL: "public-read",
          s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
        });
      }
    }
    const createdMovie = new this.movieModel({ ...dataToUpload, creator_id: user._id });
    return createdMovie.save();
  }

  async getMovieById(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException("Movie not founds");
    return movie;
  }

  async getAllMovies(query) {
    const movies = new APIFeatures(await this.movieModel.find(), query);
    if (!movies) throw new NotFoundException("Movies not found");
    return movies;
  }

  async updateMovieById(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movieToDelete = await this.movieModel.findById(id);

    if (!movieToDelete) throw new NotFoundException("Movie not found");

    const dataToUpload: Record<string, any> = { ...updateMovieDto };

    const filesToUpload = [
      { file: "image", folder: "movies", existingFile: movieToDelete.movie_url, targetFile: "movie_url" },
      { file: "thumb_nail", folder: "thumb_nails", existingFile: movieToDelete.thumb_nail, targetFile: "thumb_nail" },
    ];

    for (const { file, folder, existingFile, targetFile } of filesToUpload) {
      if (updateMovieDto[file]) {
        dataToUpload[targetFile] = await this.awsService.uploadFileToS3({
          file: updateMovieDto[file],
          folder: folder,
          ACL: "public-read",
          s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
        });

        if (existingFile) {
          await this.awsService.deleteFileFromS3({
            s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
            Location: existingFile,
          });
        }
      }
    }

    const updatedMovie = await this.movieModel.findByIdAndUpdate(id, dataToUpload, { new: true, populate: { path: "creator_id", select: "firstName lastName" } });

    // Once the movie is updated, sync movie to algolia index
    await this.algoliaService.syncMovieToIndex(updatedMovie);
    return updatedMovie;
  }

  async deleteMovieById(id: string): Promise<void> {
    const movieToDelete = await this.movieModel.findById(id);

    if (!movieToDelete) throw new NotFoundException("Movie not found");

    if (movieToDelete.movie_url) {
      await this.awsService.deleteFileFromS3({
        s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
        Location: movieToDelete.movie_url,
      });
    }

    // Delete the movie and remove from algolia index
    await Promise.all([this.movieModel.findByIdAndDelete(movieToDelete._id), this.algoliaService.removeMovieFromAIndex(movieToDelete._id.toString())]);
  }

  async approveMovie(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException("Movie not found");
    const updatedMovie = await this.movieModel.findByIdAndUpdate(id, { is_approved: true }, { new: true, populate: { path: "creator_id", select: "firstName lastName" } });

    // Once the movie is approved sync movie to algolia index
    await this.algoliaService.syncMovieToIndex(updatedMovie);

    return updatedMovie;
  }
}
