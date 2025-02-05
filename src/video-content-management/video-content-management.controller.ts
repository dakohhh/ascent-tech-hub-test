import { CONFIGS } from "configs";
import { Movie } from "./schemas/movie";
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiHttpErrorResponses } from "src/common/decorators/custom-decorator";
import { User } from "../common/decorators/user.decorator";
import { UserDocument } from "../users/user.schema";
import { VideoContentManagementService } from "./video-content-management.service";

@ApiTags("video-content-management")
@ApiBearerAuth()
@Controller("video-content-management")
export class VideoContentManagementController {
  constructor(private readonly videoContentManagementService: VideoContentManagementService) {}
  @ApiOperation({ summary: "Create a movie" })
  @ApiCreatedResponse({ description: "Movie created successfully" })
  @ApiHttpErrorResponses()
  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "file", maxCount: 1 },
      { name: "thumb_nail", maxCount: 1 },
    ])
  )
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async createMovie(@Body() createMovieDto: CreateMovieDto, @UploadedFiles() files: { file: Express.Multer.File[]; thumb_nail?: Express.Multer.File[] }, @User() user: UserDocument) {
    const movie = await this.videoContentManagementService.createMovie({ ...createMovieDto, file: files.file[0] || null, thumb_nail: files.thumb_nail?.[0] || null }, user);
    return new HttpResponse<Movie>("movie is created successfully", movie, HttpStatus.CREATED);
  }

  @ApiOperation({ summary: "Get all movies" })
  @ApiCreatedResponse({ description: "Movies fetched successfully" })
  @ApiHttpErrorResponses()
  @ApiQuery({ name: "fields", description: "Fields to return", required: false })
  @ApiQuery({ name: "limit", description: "Limit the number of results", required: false })
  @ApiQuery({ name: "page", description: "Page number", required: false })
  @ApiQuery({ name: "sort", description: "Sort by field", required: false })
  @ApiQuery({ name: "type", description: "Filter by type", required: false })
  @Get()
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER, CONFIGS.ROLES.CONTENT_MANAGER))
  async getAllMovies(@Query() query: any) {
    const movies = await this.videoContentManagementService.getAllMovies(query);
    return new HttpResponse("movies fetched successfully", movies, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Get a single movie by id" })
  @ApiCreatedResponse({ description: "Movie fetched successfully" })
  @ApiHttpErrorResponses()
  @Get(":movieId")
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER, CONFIGS.ROLES.CONTENT_MANAGER))
  async getSingleMovieById(@Param("movieId") movieId: string) {
    const movie = await this.videoContentManagementService.getMovieById(movieId);
    return new HttpResponse<Movie>("movie fetched successfully", movie, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Update a movie by id" })
  @ApiCreatedResponse({ description: "Movie updated successfully" })
  @ApiHttpErrorResponses()
  @Patch(":movieId")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image", maxCount: 1 },
      { name: "thumb_nail", maxCount: 1 },
    ])
  )
  @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
  async updateMovieById(@Param("movieId") movieId: string, @Body() updateMovieDto: UpdateMovieDto, @UploadedFiles() files: { file: Express.Multer.File[]; thumb_nail: Express.Multer.File[] }) {
    const movie = await this.videoContentManagementService.updateMovieById(movieId, { ...updateMovieDto, file: files.file[0] || null, thumb_nail: files.thumb_nail?.[0] || null });
    return new HttpResponse<Movie>("movie updated successfully", movie, HttpStatus.OK);
  }

  @ApiOperation({ summary: "Delete a movie by id" })
  @ApiCreatedResponse({ description: "Movie deleted successfully" })
  @ApiHttpErrorResponses()
  @Delete(":movieId")
  // @UseGuards(JWTRoleGuard(CONFIGS.ROLES.CONTENT_MANAGER))
  async deleteMovieById(@Param("movieId") movieId: string) {
    await this.videoContentManagementService.deleteMovieById(movieId);
    return new HttpResponse<string>("movie deleted successfully", null, HttpStatus.NO_CONTENT);
  }

  @ApiOperation({ summary: "A super admin approves a movie" })
  @ApiCreatedResponse({ description: "movie approved successfully" })
  @ApiHttpErrorResponses()
  @Patch(":movieId/approve")
  // @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
  async approveMovie(@Param("movieId") movieId: string) {
    const movie = await this.videoContentManagementService.approveMovie(movieId);
    return new HttpResponse<Movie>("movie approved successfully", movie, HttpStatus.OK);
  }
}
