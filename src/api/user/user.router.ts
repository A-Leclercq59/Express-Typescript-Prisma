import type { Response } from "express";
import express from "express";

import { IGetPayloadInfoRequest } from "../../../type";
import { isAuthenticated } from "../../middlewares/authenticate";
import * as UserService from "./user.service";

export const userRouter = express.Router();

// GET: get a profile
userRouter.get(
  "/profile",
  isAuthenticated,
  async (request: IGetPayloadInfoRequest, response: Response) => {
    try {
      if (!request.payload) {
        return response.status(401).json({ error: "Unauthorized" });
      }
      const { userId } = request.payload;
      const user = await UserService.getUserById(userId);

      if (!user) {
        return response.status(404).json({ error: "User could not be found!" });
      }

      const { password, ...userInfo } = user;

      response.status(200).json({ ...userInfo });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
