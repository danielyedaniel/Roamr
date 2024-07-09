SELECT p."post_id", p."description", p."comments_count", p."image", p."location_id", p."user_id"
FROM "follows" f, "posts" p
WHERE f."followed_id" = p."user_id" AND f."follower_id" = 5;
