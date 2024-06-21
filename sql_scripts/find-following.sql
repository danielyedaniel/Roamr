SELECT u."userID", u."email", u."firstName", u."lastName", u."profilePicture", u."dateCreated"
FROM "Follow" f, "User" u
WHERE f."followedID" = u."userID" AND f."followerID" = 5;
