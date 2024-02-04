import { db } from "../../utils/db.server";

type BookWrite = {
  title: string;
  datePublished: Date;
  authorId: number;
  isFiction: boolean;
};

export const getAllBooks = async () => {
  return db.book.findMany({
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getBookById = async (id: number) => {
  return db.book.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createBook = async (book: BookWrite) => {
  const { title, authorId, datePublished, isFiction } = book;
  const parseDate: Date = new Date(datePublished);

  return db.book.create({
    data: {
      title,
      authorId,
      isFiction,
      datePublished: parseDate,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateBook = async (book: BookWrite, id: number) => {
  const { title, authorId, datePublished, isFiction } = book;
  const parseDate: Date = new Date(datePublished);

  return db.book.update({
    where: {
      id,
    },
    data: {
      title,
      authorId,
      isFiction,
      datePublished: parseDate,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteBook = async (id: number) => {
  return db.book.delete({
    where: {
      id,
    },
  });
};
