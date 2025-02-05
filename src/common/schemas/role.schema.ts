import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Permissions } from "./permissions.schema";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Roles {
  @Prop({ type: String, required: true, unique: true }) // e.g.,'admin', 'finance' etc
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Permissions" }])
  permissions: Permissions[];
}

export type RolesDocument = mongoose.HydratedDocument<Roles>;

export const RolesSchema = SchemaFactory.createForClass(Roles);
