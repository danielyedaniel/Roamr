-- SWITCH BETWEEN THE BELOW TWO CREATE TABLES FOR THE UNOPTIMIZED/UNTUNED DATABASE AND THE OPTIMIZED DATABASE

-- \i /docker-entrypoint-initdb.d/sql_scripts/create_tables.sql
\i /docker-entrypoint-initdb.d/sql_scripts/create_tables_optimized.sql

COPY "locations" ("location_id", "latitude", "longitude", "country", "city")
FROM '/docker-entrypoint-initdb.d/data/locations.csv' DELIMITER ',' CSV HEADER;

COPY "users" ("user_id", "email", "username", "password_hash", "profile_picture", "first_name", "last_name", "date_created")
FROM '/docker-entrypoint-initdb.d/data/users.csv' DELIMITER ',' CSV HEADER;

COPY "posts" ("user_id", "post_id", "location_id", "description", "comments_count", "image", "date_created")
FROM '/docker-entrypoint-initdb.d/data/posts.csv' DELIMITER ',' CSV HEADER;

COPY "follows" ("follower_id", "followed_id")
FROM '/docker-entrypoint-initdb.d/data/follows.csv' DELIMITER ',' CSV HEADER;

COPY "comments" ("comment_id", "post_id", "user_id", "content", "date_created")
FROM '/docker-entrypoint-initdb.d/data/comments.csv' DELIMITER ',' CSV HEADER;

COPY "ratings" ("user_id", "location_id", "rating", "review", "date_created")
FROM '/docker-entrypoint-initdb.d/data/ratings.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('"locations"', 'location_id'), COALESCE(MAX("location_id"), 1) + 1, false) FROM "locations";
SELECT setval(pg_get_serial_sequence('"users"', 'user_id'), COALESCE(MAX("user_id"), 1) + 1, false) FROM "users";
SELECT setval(pg_get_serial_sequence('"posts"', 'post_id'), COALESCE(MAX("post_id"), 1) + 1, false) FROM "posts";
SELECT setval(pg_get_serial_sequence('"comments"', 'comment_id'), COALESCE(MAX("comment_id"), 1) + 1, false) FROM "comments";

UPDATE "posts" SET "comments_count" = (
    SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = "posts"."post_id"
);
