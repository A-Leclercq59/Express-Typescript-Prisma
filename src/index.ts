import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { authorRouter } from "./author/author.router";
import { bookRouter } from "./book/book.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
