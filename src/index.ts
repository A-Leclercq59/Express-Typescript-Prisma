import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { authorRouter } from "./author/author.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/authors", authorRouter);

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
