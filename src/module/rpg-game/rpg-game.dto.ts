import { User } from "@prisma/client";

export type RpgGameDTO = {
  userId: string,
  name: string;
  description: string;
  user: User
};
