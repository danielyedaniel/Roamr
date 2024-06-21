\i /docker-entrypoint-initdb.d/sql_scripts/create_tables.sql

COPY "Location" ("locationID", "latitude", "longitude", "country", "city") 
FROM '/docker-entrypoint-initdb.d/data/locations_100.csv' DELIMITER ',' CSV HEADER;

COPY "User" ("userID", "email", "username", "passwordHash", "profilePicture", "firstName", "lastName", "dateCreated") 
FROM '/docker-entrypoint-initdb.d/data/users_100.csv' DELIMITER ',' CSV HEADER;

COPY "Post" ("userID", "postID", "locationID", "description", "commentsCount", "image") 
FROM '/docker-entrypoint-initdb.d/data/posts_1000.csv' DELIMITER ',' CSV HEADER;

COPY "Follow" ("followerID", "followedID") 
FROM '/docker-entrypoint-initdb.d/data/follows_500.csv' DELIMITER ',' CSV HEADER;

COPY "Comment" ("commentID", "postID", "userID", "content") 
FROM '/docker-entrypoint-initdb.d/data/comments_2000.csv' DELIMITER ',' CSV HEADER;
