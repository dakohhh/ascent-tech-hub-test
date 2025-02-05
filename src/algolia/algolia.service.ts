import { Injectable, OnModuleInit } from "@nestjs/common";
import { Movie } from "src/video-content-management/schemas/movie";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { algoliasearch, Algoliasearch } from "algoliasearch";

@Injectable()
export class AlgoliaService implements OnModuleInit {
  private algoliaClient: Algoliasearch;
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    private readonly configService: ConfigService
  ) {
    const algoliaAPiKey = this.configService.get("CONFIGS.ALGOLIA.ALGOLIA_API_KEY");
    const algoliaAppId = this.configService.get("CONFIGS.ALGOLIA.ALGOLIA_APP_ID");

    console.log(algoliaAppId);
    this.algoliaClient = algoliasearch(algoliaAppId, algoliaAPiKey);
  }

  async onModuleInit() {
    console.log("Syncing data to Algolia...");
    // await this.syncMoviesIndexToAlgolia();

    // Add other syncs here...
  }

  // This function has not been implemented, if you can do it, go ahead.
  async setAlgoliaIndexSettings() {
    const settingsResponse = await this.algoliaClient.setSettings({
      indexName: Movie.name,
      indexSettings: { searchableAttributes: ["title", "description", "creator_id.firstName", "creator_id.lastName"] },
    });

    return settingsResponse;
  }

  async syncMoviesIndexToAlgolia() {
    try {
      // Fetch movies from MongoDB
      const movies = await this.movieModel
        .find()
        .select(["_id", "title", "genres", "releaseDate", "description", "thumb_nail", "average_rating"])
        .populate({
          path: "creator_id",
          select: "firstName lastName",
        })
        .lean()
        .exec();

      if (!movies || movies.length === 0) {
        console.log("No movies found to sync with Algolia.");
        return;
      }

      // Prepare the movies data for Algolia
      const algoliaData = movies.map((movie) => ({
        objectID: movie._id.toString(),
        title: movie.title,
        genres: movie.genres,
        releaseDate: movie.releaseDate,
        description: movie.description,
        thumb_nail: movie.thumb_nail,
        average_rating: movie.average_rating,
        creator_id: {
          firstName: movie.creator_id["firstName"],
          lastName: movie.creator_id["lastName"],
        },
      }));

      // // Push the data to Algolia
      const response = await this.algoliaClient.saveObjects({ indexName: Movie.name, objects: algoliaData, waitForTasks: true });
      console.log("Movies synced to Algolia!", response);
    } catch (error) {
      console.error("Error syncing movies to Algolia:", error);
      throw error;
    }
  }

  // Sync a movie to Algolia
  async syncMovieToIndex(doc: any): Promise<void> {
    try {
      await this.algoliaClient.saveObject({
        indexName: Movie.name,
        body: {
          objectID: doc._id.toString(),
          title: doc.title,
          genres: doc.genres,
          releaseDate: doc.releaseDate,
          description: doc.description,
          thumb_nail: doc.thumb_nail,
          average_rating: doc.average_rating,
          creator_id: {
            firstName: doc.creator_id["firstName"],
            lastName: doc.creator_id["lastName"],
          },
        },
      });
    } catch (error) {
      console.error("Error syncing movie to Algolia:", error);
    }
  }

  async removeMovieFromAIndex(objectID) {
    try {
      await this.algoliaClient.deleteObject({ indexName: Movie.name, objectID });
    } catch (error) {
      console.error(`Error removing movie with ID ${objectID} from Algolia:`, error);
      throw error;
    }
  }

  // Delete a movie from Algolia
  async deleteMovie(doc: any): Promise<void> {
    try {
      await this.algoliaClient.deleteObject(doc._id.toString());
      console.log(`Movie with ID ${doc._id} deleted from Algolia.`);
    } catch (error) {
      console.error("Error deleting movie from Algolia:", error);
    }
  }

  async searchIndex(query: string, index) {
    const { results } = await this.algoliaClient.search({
      requests: [
        {
          indexName: index.name,
          query: query,
        },
      ],
    });

    return results;
  }
}
