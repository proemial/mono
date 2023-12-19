import { pgTable, integer, text, real } from "drizzle-orm/pg-core";

export const testTable = pgTable("test", {
  id: integer("id"),
  name: text("name"),
  value: real("value"),
  newValue: real("newValue"),
  next: real("next"),
  hello: real("hello"),
  world: real("world"),
});
