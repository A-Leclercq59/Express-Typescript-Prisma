import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
