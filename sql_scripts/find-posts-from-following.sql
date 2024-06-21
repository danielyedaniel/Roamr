SELECT p."postID", p."description", p."commentsCount", p."image", p."locationID", p."userID"
FROM "Follow" f, "Post" p
WHERE f."followedID" = p."userID" AND f."followerID" = 5;
