import * as mongoose from "mongoose";
import { User } from "../../users/user.schema";
import { Gender } from "../../users/user.schema";

export const createMockUser = (override: Partial<User> = {}): User & { _id: mongoose.Types.ObjectId } => ({
  _id: new mongoose.Types.ObjectId(),
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+2347012345678",
  password: "hashedPassword123",
  gender: Gender.MALE,
  created_at: new Date(),
  updated_at: new Date(),
  ...override,
});

export const mockAuthTokens = {
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
};
