CREATE TABLE "User" (
  "userID" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "profilePicture" TEXT NOT NULL,
  "dateCreated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Follow" (
  "followerID" INT NOT NULL,
  "followedID" INT NOT NULL,
  PRIMARY KEY ("followerID", "followedID"),
  CONSTRAINT "fk_followerID" FOREIGN KEY ("followerID") REFERENCES "User" ("userID") ON DELETE CASCADE,
  CONSTRAINT "fk_followedID" FOREIGN KEY ("followedID") REFERENCES "User" ("userID") ON DELETE CASCADE
);

CREATE TABLE "Location" (
  "locationID" SERIAL PRIMARY KEY,
  "country" VARCHAR(255),
  "city" VARCHAR(255),
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  UNIQUE ("country", "city")
);

CREATE TABLE "Post" (
  "userID" INT NOT NULL,
  "postID" SERIAL PRIMARY KEY,
  "description" TEXT NOT NULL,
  "commentsCount" INT NOT NULL,
  "image" TEXT NOT NULL,
  "locationID" INT,
  CONSTRAINT "fk_userID" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE CASCADE,
  CONSTRAINT "fk_locationID" FOREIGN KEY ("locationID") REFERENCES "Location" ("locationID") ON DELETE SET NULL
);

CREATE TABLE "Comment" (
  "commentID" SERIAL PRIMARY KEY,
  "postID" INT NOT NULL,
  "userID" INT NOT NULL,
  "content" TEXT NOT NULL,
  CONSTRAINT "fk_postID" FOREIGN KEY ("postID") REFERENCES "Post" ("postID") ON DELETE CASCADE,
  CONSTRAINT "fk_comment_userID" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE CASCADE
);

CREATE TABLE "Rating" (
  "userID" INT NOT NULL,
  "locationID" INT NOT NULL,
  "rating" INT NOT NULL,
  PRIMARY KEY ("userID", "locationID"),
  CONSTRAINT "fk_rating_userID" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE CASCADE,
  CONSTRAINT "fk_rating_locationID" FOREIGN KEY ("locationID") REFERENCES "Location" ("locationID") ON DELETE CASCADE
);
