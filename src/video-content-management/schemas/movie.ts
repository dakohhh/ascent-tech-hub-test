import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export enum Genre {
  ACTION = "Action",
  DRAMA = "Drama",
  COMEDY = "Comedy",
  HORROR = "Horror",
}

export enum Language {
  ENGLISH = "en", // For English
  YORUBA = "yo", // For Yoruba
  HAUSA = "ha", // For Hausa

  // Add more here..
}

export type MovieDocument = Movie & mongoose.Document;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Movie {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty()
  @Prop({
    type: [String],
    required: true,
    enum: Genre,
    validate: {
      validator: (value: string[]) => Array.isArray(value) && value.length > 0,
      message: "Genres must be a non-empty array",
    },
  })
  genres: Genre[];

  @ApiProperty()
  @Prop({ type: Date, required: true })
  releaseDate: Date;

  @ApiProperty()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty()
  @Prop({ enum: Language, required: true })
  language: Language;

  @ApiProperty()
  @Prop({ type: String, required: true })
  movie_url: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  thumb_nail: string;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  average_rating: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  number_of_reviews: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  likeCount: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  commentCount: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  creator_id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  is_approved: boolean;

  @ApiProperty({ default: Date.now })
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

// Mongoose Hooks for Algolia Sync
// MovieSchema.post('save', async function (doc: Movie) {
//   try {
//     await algoliaClient.saveObject({
//       objectID: doc._id.toString(),
//       title: doc.title,
//       genres: doc.genres,
//       releaseDate: doc.releaseDate,
//       description: doc.description,
//       averageRating: doc.averageRating,
//       numberOfReviews: doc.numberOfReviews,
//       creatorId: doc.creatorId,
//     });
//     console.log(`Movie ${doc.title} synced to Algolia.`);
//   } catch (error) {
//     console.error(`Failed to sync movie ${doc.title} to Algolia:`, error);
//   }
// });

// MovieSchema.post('deleteOne', { document: true }, async function (doc: Movie) {
//   try {
//     await algoliaClient.deleteObject(doc._id.toString());
//     console.log(`Movie ${doc.title} removed from Algolia.`);
//   } catch (error) {
//     console.error(`Failed to remove movie ${doc.title} from Algolia:`, error);
//   }
// });