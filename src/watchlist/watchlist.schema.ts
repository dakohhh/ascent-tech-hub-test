import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type WatchListDocument = mongoose.HydratedDocument<WatchList>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class WatchList {
  @ApiProperty({ type: String, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Movie" })
  user: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Movie" })
  movie: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Profile" })
  profile: mongoose.Types.ObjectId;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export const WatchListSchema = SchemaFactory.createForClass(WatchList);
