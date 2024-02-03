import type { Request, Response } from "express";
import express from "express";

import { validate } from "../utils/validate";
import { authorSchema } from "./author.schema";
import * as AuthorService from "./author.service";

export const authorRouter = express.Router();

// Get: List of all Authors
authorRouter.get("/", async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.getAllAuthors();
    return response.status(200).json(authors);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// Get: Author by Id
authorRouter.get("/:id", async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  try {
    const author = await AuthorService.getAuthorById(id);

    if (author) {
      return response.status(200).json(author);
    }

    return response.status(404).json({ error: "Author could not be found!" });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// Post: Create a author
authorRouter.post(
  "/",
  validate(authorSchema),
  async (request: Request, response: Response) => {
    try {
      const newAuthor = await AuthorService.createAuthor(request.body);
      return response.status(201).json(newAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// PUT: Update a author
authorRouter.put(
  "/:id",
  validate(authorSchema),
  async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);

    try {
      const author = await AuthorService.getAuthorById(id);

      if (author) {
        const updatedAuthor = await AuthorService.updateAuthor(
          request.body,
          id
        );
        return response.status(200).json(updatedAuthor);
      }

      return response.status(404).json({ error: "Author could not be found!" });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// DELETE: Delete a author
authorRouter.delete("/:id", async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  try {
    const author = await AuthorService.getAuthorById(id);

    if (author) {
      await AuthorService.deleteAuthor(id);

      return response.status(200).json("Author deleted");
    }

    return response.status(404).json({ error: "Author could not be found!" });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
