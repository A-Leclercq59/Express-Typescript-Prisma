import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { JWT_REFRESH_SECRET, generateTokens } from "../../utils/jwt";
import { validate } from "../../utils/validate";
import { authSchema, refreshTokenSchema } from "./auth.schema";

import { hashToken } from "../../utils/hashToken";
import * as UserService from "../user/user.service";
import * as AuthService from "./auth.service";

export const authRouter = express.Router();

// POST: Register
authRouter.post(
  "/register",
  validate(authSchema),
  async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const existingUser = await UserService.getUserByEmail(email);

      if (existingUser) {
        response.status(400).json({ error: "Email already use!" });
      }

      const user = await UserService.createUserByEmailAndPassword({
        email,
        password,
      });
      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(user.id, jti);
      await AuthService.addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: user.id,
      });

      return response.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// POST: Login
authRouter.post(
  "/login",
  validate(authSchema),
  async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const existingUser = await UserService.getUserByEmail(email);

      if (!existingUser) {
        response.status(403).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser?.password!
      );

      if (!validPassword) {
        response.status(403).json({ error: "Invalid credentials" });
      }

      const { password: userPassword, ...userInfo } = existingUser!;

      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(
        existingUser?.id!,
        jti
      );
      await AuthService.addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: existingUser?.id!,
      });

      return response
        .status(200)
        .json({ user: { ...userInfo }, accessToken, refreshToken });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// POST: Refresh token
authRouter.post(
  "/refreshToken",
  validate(refreshTokenSchema),
  async (request: Request, response: Response) => {
    try {
      const { refreshToken } = request.body;
      const payload = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET
      ) as JwtPayload;

      const savedRefreshToken = await AuthService.findRefreshToken(
        payload?.jti!
      );

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        response.status(401).json({ error: "Unauthorized" });
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken?.hashedToken) {
        response.status(401).json({ error: "Unauthorized" });
      }

      const user = await UserService.getUserById(payload.userId);
      if (!user) {
        response.status(401).json({ error: "Unauthorized" });
      }

      await AuthService.deleteRefreshToken(savedRefreshToken?.id!);
      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user?.id!,
        jti
      );
      await AuthService.addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: user?.id!,
      });

      return response.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// POST: Revoke refreshToken
// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
authRouter.post(
  "/revokeRefreshToken",
  async (request: Request, response: Response) => {
    try {
      const { userId } = request.body;
      await AuthService.revokeTokens(userId);
      response
        .status(200)
        .json({ message: `Token revoked for user with id ${userId}` });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
