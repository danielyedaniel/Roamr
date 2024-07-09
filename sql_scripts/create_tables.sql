CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "profile_picture" TEXT NOT NULL,
  "date_created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "follows" (
  "follower_id" INT NOT NULL,
  "followed_id" INT NOT NULL,
  PRIMARY KEY ("follower_id", "followed_id"),
  CONSTRAINT "fk_follower_id" FOREIGN KEY ("follower_id") REFERENCES "users" ("user_id") ON DELETE CASCADE,
  CONSTRAINT "fk_followed_id" FOREIGN KEY ("followed_id") REFERENCES "users" ("user_id") ON DELETE CASCADE
);

CREATE TABLE "locations" (
  "location_id" SERIAL PRIMARY KEY,
  "country" VARCHAR(255),
  "city" VARCHAR(255),
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  UNIQUE ("country", "city")
);

CREATE TABLE "posts" (
  "post_id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "description" TEXT NOT NULL,
  "comments_count" INT NOT NULL,
  "image" TEXT NOT NULL,
  "location_id" INT,
  "date_created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE,
  CONSTRAINT "fk_location_id" FOREIGN KEY ("location_id") REFERENCES "locations" ("location_id") ON DELETE SET NULL
);

CREATE TABLE "comments" (
  "comment_id" SERIAL PRIMARY KEY,
  "post_id" INT NOT NULL,
  "user_id" INT NOT NULL,
  "content" TEXT NOT NULL,
  "date_created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_post_id" FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE CASCADE,
  CONSTRAINT "fk_comment_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE
);

CREATE TABLE "ratings" (
  "user_id" INT NOT NULL,
  "location_id" INT NOT NULL,
  "rating" INT NOT NULL,
  "review" TEXT,
  "date_created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "location_id"),
  CONSTRAINT "fk_rating_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE,
  CONSTRAINT "fk_rating_location_id" FOREIGN KEY ("location_id") REFERENCES "locations" ("location_id") ON DELETE CASCADE
);
