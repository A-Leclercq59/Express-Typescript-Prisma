import jwt from "jsonwebtoken";

export const JWT_ACCESS_SECRET = "SECRET123";
export const JWT_REFRESH_SECRET = "ANOTHER_SECRET123";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId: userId }, JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
};

export const generateRefreshToken = (userId: string, jti: string) => {
  return jwt.sign(
    {
      userId: userId,
      jti,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "8h",
    }
  );
};

export const generateTokens = (userId: string, jti: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, jti);

  return {
    accessToken,
    refreshToken,
  };
};
