import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IGetPayloadInfoRequest } from "../../type";
import { JWT_ACCESS_SECRET } from "../utils/jwt";

export const isAuthenticated = (
  request: IGetPayloadInfoRequest,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    request.payload = payload;
  } catch (error: any) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  return next();
};
