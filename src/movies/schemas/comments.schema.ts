import * as mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Comments {
  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
  user: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true, example: "60f1b0b3b3b3b3b3b3b3b3b3" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Movie" })
  movie: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Comments", default: null })
  parentId: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }])
  replies: mongoose.Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  repliesCount: number;

  @Prop({ type: String, required: true })
  content: string;
}

export type CommentsDocument = mongoose.HydratedDocument<Comments>;

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.post("save", async function (doc: CommentsDocument) {
  console.log("Comments saved", doc);
});
