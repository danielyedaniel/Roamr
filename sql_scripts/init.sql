\i /docker-entrypoint-initdb.d/sql_scripts/create_tables.sql

COPY "locations" ("location_id", "latitude", "longitude", "country", "city")
FROM '/docker-entrypoint-initdb.d/data/locations_100.csv' DELIMITER ',' CSV HEADER;

COPY "users" ("user_id", "email", "username", "password_hash", "profile_picture", "first_name", "last_name", "date_created")
FROM '/docker-entrypoint-initdb.d/data/users_100.csv' DELIMITER ',' CSV HEADER;

COPY "posts" ("user_id", "post_id", "location_id", "description", "comments_count", "image")
FROM '/docker-entrypoint-initdb.d/data/posts_1000.csv' DELIMITER ',' CSV HEADER;

COPY "follows" ("follower_id", "followed_id")
FROM '/docker-entrypoint-initdb.d/data/follows_500.csv' DELIMITER ',' CSV HEADER;

COPY "comments" ("comment_id", "post_id", "user_id", "content")
FROM '/docker-entrypoint-initdb.d/data/comments_2000.csv' DELIMITER ',' CSV HEADER;

COPY "ratings" ("user_id", "location_id", "rating")
FROM '/docker-entrypoint-initdb.d/data/ratings_2000.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('"locations"', 'location_id'), COALESCE(MAX("location_id"), 1) + 1, false) FROM "locations";
SELECT setval(pg_get_serial_sequence('"users"', 'user_id'), COALESCE(MAX("user_id"), 1) + 1, false) FROM "users";
SELECT setval(pg_get_serial_sequence('"posts"', 'post_id'), COALESCE(MAX("post_id"), 1) + 1, false) FROM "posts";
SELECT setval(pg_get_serial_sequence('"comments"', 'comment_id'), COALESCE(MAX("comment_id"), 1) + 1, false) FROM "comments";
