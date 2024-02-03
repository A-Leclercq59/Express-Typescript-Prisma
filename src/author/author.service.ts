import { db } from "../utils/db.server";

type Author = {
  id: number;
  firstName: string;
  lastName: string;
};

export const getAllAuthors = async () => {
  return db.author.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const getAuthorById = async (id: number) => {
  return db.author.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const createAuthor = async ({
  firstName,
  lastName,
}: Omit<Author, "id">) => {
  return db.author.create({
    data: {
      firstName: firstName,
      lastName: lastName,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const updateAuthor = async (
  { firstName, lastName }: Omit<Author, "id">,
  id: number
) => {
  return db.author.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const deleteAuthor = async (id: number) => {
  return db.author.delete({
    where: {
      id,
    },
  });
};
