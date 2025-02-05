import { Controller, Get, UseGuards, Request, Post, HttpStatus, Param, Body } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CONFIGS } from "configs";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { ApiHttpErrorResponses } from "src/common/decorators/custom-decorator";
import { MoviesService } from "./movies.service";
import { User } from "src/users/user.schema";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { CreateCommentDto } from "./dto/comment.dto";
@ApiTags("Movies")
@Controller("movies")
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  @Post(":movieId/like")
  @ApiOperation({ summary: "Like a movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async likeMovie(@Request() request: Request & { user: User }, @Param("movieId") movieId: string) {
    await this.movieService.likeMovie(request.user, movieId);
    return new HttpResponse("Liked Movie Successfully", null, HttpStatus.OK);
  }
  @Post(":movieId/dislike")
  @ApiOperation({ summary: "Dislike a movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async dislikeMovie(@Request() request: Request & { user: User }, @Param("movieId") movieId: string) {
    await this.movieService.disLikeMovie(request.user, movieId);
    return new HttpResponse("Disliked Movie Successfully", null, HttpStatus.OK);
  }

  @Get(":movieId/totalLikes")
  @ApiOperation({ summary: "Dislike a movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getTotalLikes(@Param("movieId") movieId: string) {
    const results = await this.movieService.getTotalLikes(movieId);
    return new HttpResponse("Get Total Likes For Movie", results, HttpStatus.OK);
  }

  @Get(":movieId")
  @ApiOperation({ summary: "Get movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getMovieById(@Param("movieId") movieId: string) {
    const results = await this.movieService.getMovieIfApproved(movieId);

    return new HttpResponse("Get Movie", results, HttpStatus.OK);
  }

  @Post(":movieId/comments")
  @ApiOperation({ summary: "Comment on Movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async commentOnMovie(@Request() request: Request & { user: User }, @Param("movieId") movieId: string, @Body() createCommentDto: CreateCommentDto) {
    const results = await this.movieService.commentOnMovie(request.user, movieId, createCommentDto);
    return new HttpResponse("Comment on Movie", results, HttpStatus.OK);
  }

  @Get(":movieId/comments")
  @ApiOperation({ summary: "Get Comments on Movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getComments(@Param("movieId") movieId: string) {
    return this.movieService.getCommentsOnMovie(movieId);
  }

  @Get(":movieId/comments/:commentId/replies")
  @ApiOperation({ summary: "Get Comments on Movie" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getRepliesOnComment(@Param("movieId") movieId: string, @Param("commentId") commentId: string) {
    return this.movieService.getRepliesOnComment(movieId, commentId);
  }
}
