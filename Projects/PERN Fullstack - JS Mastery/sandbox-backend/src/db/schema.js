// Drizzle ORM Schema
const {
  pgTable,
  serial,
  varchar,
  numeric,
  boolean,
  timestamp,
} = require("drizzle-orm/pg-core");

const pokemon = pgTable("pokemon", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 100 }).array().notNull(),
  height: numeric("height", { precision: 5, scale: 1 }).notNull(),
  evolves: boolean("evolves"),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { pokemon };
