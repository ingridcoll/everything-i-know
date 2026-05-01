CREATE TABLE "pokemon" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100)[] NOT NULL,
	"height" numeric(5, 1) NOT NULL,
	"evolves" boolean,
	"created_at" timestamp DEFAULT now()
);
