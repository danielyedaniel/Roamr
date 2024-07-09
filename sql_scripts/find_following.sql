SELECT u."user_id", u."email", u."first_name", u."last_name", u."profile_picture", u."date_created"
FROM "follows" f, "users" u
WHERE f."followed_id" = u."user_id" AND f."follower_id" = 5;
