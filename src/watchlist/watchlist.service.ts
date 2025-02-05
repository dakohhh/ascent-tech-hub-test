import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WatchList } from "./watchlist.schema";
import { AddToWatchListDto } from "./watchlist.dto";
import { User } from "src/users/user.schema";
import { Profile } from "src/profile/profile.schema";
import { ProfileService } from "src/profile/profile.service";
import { MoviesService } from "src/movies/movies.service";

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(WatchList.name) private readonly watchListModel: Model<WatchList>,
    @InjectModel(Profile.name) profile: Model<Profile>,
    private readonly profileService: ProfileService,
    private readonly movieService: MoviesService
  ) {}
  async getWatchList(user: User, profileId: string) {
    const profile = this.profileService.getProfile(user, profileId);

    if (!profile) throw new NotFoundException("Profile not found");

    const watchlistItems = await this.watchListModel
      .find({ profile: profileId })
      .populate({
        path: "movie",
        select: "title description releaseDate thumb_nail",
      })
      .lean()
      .exec();

    return watchlistItems;
  }
  async addToWatchList(user: User, addToWatchListDto: AddToWatchListDto) {
    // Check if the profile for the user exist as well as the movie
    const [profile, movie] = await Promise.all([this.profileService.getProfile(user, addToWatchListDto.profile), this.movieService.getMovieIfApproved(addToWatchListDto.movie)]);

    if (!profile) throw new NotFoundException("Profile not found");

    // Check if the movie already exists for that profile

    const watchListItem = await this.watchListModel.findOne({ profile: profile._id, movie: movie._id, user: user._id }).select(["_id"]).lean().exec();

    if (watchListItem) throw new BadRequestException("Movie already in watchlist");

    const newWatchListItem = await this.watchListModel.create({ profile: profile._id, movie: movie._id, user: user._id });

    return newWatchListItem;
  }

  async removeFromWatchList(user: User, watchListId: string) {
    const watchListItem = await this.watchListModel.findOne({ user: user._id, _id: watchListId }).select(["_id"]).lean().exec();

    if (!watchListItem) throw new NotFoundException("Watch list item not found");

    await this.watchListModel.deleteOne({ _id: watchListItem._id });
  }
}
