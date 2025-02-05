import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Movie } from "src/video-content-management/schemas/movie";
import { Likes } from "./schemas/likes.schema";
import { User } from "src/users/user.schema";
import { Comments } from "./schemas/comments.schema";
import { CreateCommentDto } from "./dto/comment.dto";
@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Likes.name) private readonly likeModel: Model<Likes>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>
  ) {}

  async likeMovie(user: User, movieId: string) {
    // Check if movie exists

    const movie = await this.movieModel.findById(movieId).select(["_id"]).lean().exec();

    if (!movie) throw new NotFoundException("Movie not found");
    // Check if user has already liked the movie
    const like = await this.likeModel.findOne({ user: user._id, movie: movieId }).lean().exec();

    if (like) return;

    await Promise.all([this.likeModel.create({ user: user._id, movie: movieId }), this.movieModel.findByIdAndUpdate(movieId, { $inc: { likeCount: 1 } })]);
  }

  async disLikeMovie(user: User, movieId: string) {
    // Check if movie exists

    const movie = await this.movieModel.findById(movieId).select(["_id"]).lean().exec();

    if (!movie) throw new NotFoundException("Movie not found");
    // Check if user has already liked the movie
    const like = await this.likeModel.findOne({ user: user._id, movie: movieId }).select(["_id"]).lean().exec();

    if (!like) return;

    await Promise.all([this.likeModel.deleteOne({ _id: like._id }), this.movieModel.findByIdAndUpdate(movieId, { $inc: { likeCount: -1 } })]);
  }

  async getTotalLikes(movieId: string) {
    const movie = await this.movieModel.findById(movieId).select(["_id", "likeCount"]).lean().exec();
    return movie;
  }

  async getMovieIfApproved(movieId: string) {
    const movie = await this.movieModel.findById(movieId).lean().exec();
    // If the movie is not approved, then throw a Not Found because its not public to the user
    if (!movie || !movie.is_approved) {
      throw new NotFoundException("Movie not found");
    }
    return movie;
  }

  async commentOnMovie(user: User, movieId: string, createCommentDto: CreateCommentDto) {
    const movie = await this.movieModel.findById(movieId).select(["_id", "is_approved"]).lean().exec();
    if (!movie || !movie.is_approved) throw new NotFoundException("Movie not found");
    const savedComment = await this.commentModel.create({
      user: user._id,
      movie: movie._id,
      content: createCommentDto.content,
      parentId: createCommentDto.parentId ? new Types.ObjectId(createCommentDto.parentId) : null,
    });

    // If the comment has a parent Id, attach it to the replies of the parent comment
    if (createCommentDto.parentId) {
      await this.commentModel.findByIdAndUpdate(createCommentDto.parentId, {
        $push: {
          replies: savedComment._id,
        },
        $inc: {
          repliesCount: 1,
        },
      });
    }

    await this.movieModel.findByIdAndUpdate(movie._id, { $inc: { commentCount: 1 } });
    return savedComment;
  }

  async getCommentsOnMovie(movieId: string) {
    const movie = await this.movieModel.findById(movieId).select(["_id", "is_approved"]).lean().exec();
    if (!movie || !movie.is_approved) throw new NotFoundException("Movie not found");
    const comments = await this.commentModel.find({ movie: movie._id, parentId: null });

    return comments;
  }
  // Only Get replies on the top level comments (parentId -> null), as replies should not be parents
  async getRepliesOnComment(movieId, commentId) {
    const comment = await this.commentModel
      .findById(commentId)
      .select(["replies"])
      .populate({
        path: "replies",
        select: "-replies -repliesCount",
        populate: {
          path: "replies",
          model: "Comments",
        },
      })
      .exec();

    if (!comment) throw new NotFoundException("Comment not found");

    return comment;
  }
}
