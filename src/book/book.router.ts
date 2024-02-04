import type { Request, Response } from "express";
import express from "express";

import { validate } from "../utils/validate";
import { bookSchema } from "./book.schema";
import * as BookService from "./book.service";

export const bookRouter = express.Router();

// GET: List of all Books
bookRouter.get("/", async (request: Request, response: Response) => {
  try {
    const books = await BookService.getAllBooks();
    return response.status(200).json(books);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// GET: get book by id
bookRouter.get("/:id", async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  try {
    const book = await BookService.getBookById(id);

    if (book) {
      return response.status(200).json(book);
    }

    return response.status(404).json({ error: "Book could not be found!" });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// POST: Create a book
bookRouter.post(
  "/",
  validate(bookSchema),
  async (request: Request, response: Response) => {
    try {
      const newBook = await BookService.createBook(request.body);
      return response.status(201).json(newBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// PUT: Update a book
bookRouter.put(
  "/:id",
  validate(bookSchema),
  async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);

    try {
      const book = await BookService.getBookById(id);

      if (!book) {
        return response.status(404).json({ error: "Book could not be found!" });
      }

      const updatedBook = await BookService.updateBook(request.body, id);
      return response.status(200).json(updatedBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// DELETE: Delete a book
bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  try {
    const book = await BookService.getBookById(id);

    if (!book) {
      return response.status(404).json({ error: "Book could not be found!" });
    }

    await BookService.deleteBook(id);
    return response.status(200).json("Book deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
