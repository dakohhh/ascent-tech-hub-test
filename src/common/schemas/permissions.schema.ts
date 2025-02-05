import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Action {
  read = "read",
  create = "create",
  update = "update",
  delete = "delete",
}

// Resource represents the models in the application.
// It is used to restrict access to certain routes based on the user's role.
// It is an enum that contains the following values: USER, ROLE, PERMISSION, TRANSACTION.
//  The values are used in the auth middleware to check if the user's role is authorized to access a particular route.
export enum Resource {
  USER = "user",
  ROLE = "role",
  PERMISSION = "permission",
  PROFILE = "profile",

  // Add more resources here.
}

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Permissions {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(Resource), required: true })
  resource: string;

  @Prop([{ type: String, enum: Object.values(Action), default: null }])
  actions: Action[];
}

export type PermissionsDocument = mongoose.HydratedDocument<Permissions>;

export const PermissionsSchema = SchemaFactory.createForClass(Permissions);
