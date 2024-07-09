\i /docker-entrypoint-initdb.d/sql_scripts/create_tables.sql

COPY "locations" ("location_id", "latitude", "longitude", "country", "city")
FROM '/docker-entrypoint-initdb.d/production_data/locations.csv' DELIMITER ',' CSV HEADER;

COPY "users" ("user_id", "email", "username", "password_hash", "profile_picture", "first_name", "last_name", "date_created")
FROM '/docker-entrypoint-initdb.d/production_data/users.csv' DELIMITER ',' CSV HEADER;

COPY "posts" ("user_id", "post_id", "location_id", "description", "comments_count", "image", "date_created")
FROM '/docker-entrypoint-initdb.d/production_data/posts.csv' DELIMITER ',' CSV HEADER;

COPY "follows" ("follower_id", "followed_id")
FROM '/docker-entrypoint-initdb.d/production_data/follows.csv' DELIMITER ',' CSV HEADER;

COPY "comments" ("comment_id", "post_id", "user_id", "content", "date_created")
FROM '/docker-entrypoint-initdb.d/production_data/comments.csv' DELIMITER ',' CSV HEADER;

COPY "ratings" ("user_id", "location_id", "rating", "review", "date_created")
FROM '/docker-entrypoint-initdb.d/production_data/ratings.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('"locations"', 'location_id'), COALESCE(MAX("location_id"), 1) + 1, false) FROM "locations";
SELECT setval(pg_get_serial_sequence('"users"', 'user_id'), COALESCE(MAX("user_id"), 1) + 1, false) FROM "users";
SELECT setval(pg_get_serial_sequence('"posts"', 'post_id'), COALESCE(MAX("post_id"), 1) + 1, false) FROM "posts";
SELECT setval(pg_get_serial_sequence('"comments"', 'comment_id'), COALESCE(MAX("comment_id"), 1) + 1, false) FROM "comments";
