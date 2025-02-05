import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CONFIGS } from "configs";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";
import { User } from "src/common/decorators/user.decorator";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { UserDocument } from "src/users/user.schema";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { RatingService } from "./rating.service";
import { Rating } from "./schema/rating";
@ApiTags("User Ratings")
@ApiBearerAuth()
@Controller("rating")
export class RatingController {
  private readonly logger = new Logger();
  constructor(private readonly ratingService: RatingService) {}

  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: HttpStatus.CREATED, type: Rating, description: "Adds rating to a movie" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Post(":movieId")
  async createMovieRating(@Body() createRatingDto: CreateRatingDto, @Param("movieId") movieId: string, @User() user: UserDocument) {
    const result = await this.ratingService.createRating(createRatingDto, user, movieId);
    await this.ratingService.handleRatingSave(result.movie_id);
    return new HttpResponse("you have rated this movie successfully", result, HttpStatus.OK);
  }

  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: HttpStatus.OK, type: Rating, isArray: true, description: "Returns all ratings" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER, CONFIGS.ROLES.SUPER_ADMIN, CONFIGS.ROLES.CONTENT_MANAGER))
  @Get(":movieId")
  async getRatingById(@Param("movieId") movieId: string) {
    const movie = await this.ratingService.getRatingById(movieId);
    return new HttpResponse("rating found", movie, HttpStatus.OK);
  }
  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: HttpStatus.OK, type: Rating, isArray: true, description: "Returns all ratings" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER, CONFIGS.ROLES.SUPER_ADMIN, CONFIGS.ROLES.CONTENT_MANAGER))
  @Get("all/ratings")
  async getAllRatings() {
    const movie = await this.ratingService.getAllRatings();
    return new HttpResponse("rating found", movie, HttpStatus.OK);
  }

  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: HttpStatus.OK, type: Rating, description: "Updates a rating" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Patch(":movieId")
  async updateRating(@Param("movieId") movieId: string, @Body() updateRatingDto: UpdateRatingDto) {
    const movie = await this.ratingService.updateRating(movieId, updateRatingDto);
    await this.ratingService.handleRatingSave(movie.movie_id);
    return new HttpResponse("rating updated", movie, HttpStatus.OK);
  }

  @ApiHttpErrorResponses()
  @ApiHttpResponse({ status: HttpStatus.OK, type: Rating, description: "Deletes a rating" })
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  @Delete(":movieId")
  async deleteRating(@Param("movieId") movieId: string) {
    const movie = await this.ratingService.deleteRating(movieId);
    await this.ratingService.handleRatingDelete(movie.movie_id);
    return new HttpResponse("rating deleted", movie, HttpStatus.OK);
  }
}
