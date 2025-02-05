import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Likes {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
  user: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Movie" })
  movie: mongoose.Types.ObjectId;
}

export type LikesDocument = mongoose.HydratedDocument<Likes>;

export const LikesSchema = SchemaFactory.createForClass(Likes);

LikesSchema.post("save", async function (doc: LikesDocument) {
  console.log("Likes saved", doc);
});
