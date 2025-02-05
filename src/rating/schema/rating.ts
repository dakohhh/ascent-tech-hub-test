import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export type RatingDocument = mongoose.HydratedDocument<Rating>;

@Schema({ timestamps: { createdAt: "created", updatedAt: "updated" } })
export class Rating {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, default: 0 })
  rating: number;

  @ApiProperty()
  @Prop({ required: true, default: "" })
  comment: string;

  @ApiProperty()
  @Prop({ required: true, ref: "Movie", type: mongoose.Types.ObjectId })
  movie_id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, ref: "User", type: mongoose.Types.ObjectId })
  user: mongoose.Types.ObjectId;

}
const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.index({ movie_id: 1, user: 1 }, { unique: true });

export { RatingSchema };
