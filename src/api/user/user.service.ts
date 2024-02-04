import bcrypt from "bcrypt";

import { db } from "../../utils/db.server";

type User = {
  email: string;
  password: string;
};

export const getUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = (id: string) => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUserByEmailAndPassword = (user: User) => {
  const { email, password } = user;
  const hashedPassword = bcrypt.hashSync(password, 12);

  return db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};
