import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { User } from "./tables-interfaces/user";

interface Database {
  user: User;
}

export const db = (DB: D1Database) => {
  const db = new Kysely<Database>({ dialect: new D1Dialect({ database: DB }) });
  return db;
};
