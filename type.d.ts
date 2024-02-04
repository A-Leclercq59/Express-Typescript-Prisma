import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IGetPayloadInfoRequest extends Request {
  payload?: JwtPayload;
}
