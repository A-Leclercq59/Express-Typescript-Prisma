import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { authRouter } from "./api/auth/auth.router";
import { authorRouter } from "./api/author/author.router";
import { bookRouter } from "./api/book/book.router";
import { userRouter } from "./api/user/user.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
