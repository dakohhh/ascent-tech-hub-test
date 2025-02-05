import { Controller, Post, UseGuards, Request, HttpStatus, Body, Delete, Param, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CONFIGS } from "configs";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { ApiHttpErrorResponses } from "src/common/decorators/custom-decorator";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { User } from "src/users/user.schema";
import { WatchlistService } from "./watchlist.service";
import { AddToWatchListDto } from "./watchlist.dto";

@ApiTags("WatchList")
@Controller("watchlist")
export class WatchlistController {
  constructor(private readonly watchListService: WatchlistService) {}

  @Get(":profileId")
  @ApiOperation({ summary: "Gets a watchlist for a particular user profile" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async getWatchList(@Request() request: Request & { user: User }, @Param("profileId") profileId: string) {
    const result = await this.watchListService.getWatchList(request.user, profileId);
    return new HttpResponse("Get watch list for profile", result, HttpStatus.OK);
  }

  @Post()
  @ApiOperation({ summary: "Add movie to a watchlist for a particular user profile" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async addToWatchList(@Request() request: Request & { user: User }, @Body() addToWatchListDto: AddToWatchListDto) {
    const result = await this.watchListService.addToWatchList(request.user, addToWatchListDto);
    return new HttpResponse("Added to watch list", result, HttpStatus.OK);
  }

  @Delete(":watchListId")
  @ApiOperation({ summary: "Remove a movie from a watchlist for a particular user profile" })
  @ApiBearerAuth()
  @ApiHttpErrorResponses()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async removeFromWatchList(@Request() request: Request & { user: User }, @Param("watchListId") watchListId: string) {
    const result = await this.watchListService.removeFromWatchList(request.user, watchListId);
    return new HttpResponse("Removed movie from watch list", result, HttpStatus.NO_CONTENT);
  }
}
