import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { UserDocument } from "src/users/user.schema";
import { Movie } from "../video-content-management/schemas/movie";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { Rating } from "./schema/rating";
@Injectable()
export class RatingService {
  private readonly logger = new Logger();
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>
  ) {}

  async createRating(ratings: CreateRatingDto, user: UserDocument, movieId: string) {
    const foundMovie = await this.movieModel.findOne({ _id: movieId });
    if (!foundMovie) throw new NotFoundException("movie is not found");

    const { comment, rating } = ratings;

    const ratingMovie = new this.ratingModel({ comment, rating, movie_id: movieId, user: user._id });
    return ratingMovie.save();
  }

  async getRatingById(id: string) {
    const foundMovie = await this.ratingModel.findById(id);
    if (!foundMovie) throw new NotFoundException("rating is not found");
    return foundMovie;
  }

  async getAllRatings() {
    return this.ratingModel.find();
  }

  async updateRating(id: string, UpdateRatingDto: Partial<Rating>) {
    const foundMovie = await this.getRatingById(id);
    if (!foundMovie) throw new NotFoundException("rating is not found");
    return this.ratingModel.findByIdAndUpdate(id, UpdateRatingDto, { new: true });
  }

  async deleteRating(id: string) {
    const foundMovie = await this.getRatingById(id);
    if (!foundMovie) throw new NotFoundException("no rating found");
    return this.ratingModel.findByIdAndDelete(id);
  }

  async calculateAverageRating(movieId: mongoose.Types.ObjectId): Promise<void> {
    const result = await this.ratingModel.aggregate([
      { $match: { movie_id: movieId } },
      {
        $group: {
          _id: null,
          average_rating: { $avg: "$rating" },
          number_of_reviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      const { average_rating, number_of_reviews } = result[0];
      await this.movieModel.findByIdAndUpdate(movieId, {
        average_rating,
        number_of_reviews,
      });
    }
  }

  async handleRatingSave(movieId: mongoose.Types.ObjectId): Promise<void> {
    await this.calculateAverageRating(movieId);
  }

  async handleRatingDelete(movieId: mongoose.Types.ObjectId): Promise<void> {
    await this.calculateAverageRating(movieId);
  }
}
