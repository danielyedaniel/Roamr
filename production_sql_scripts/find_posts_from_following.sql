SELECT p.post_id, p.description, p.comments_count, p.image, p.location_id, p.user_id, p.date_created
FROM follows f
JOIN posts p ON f.followed_id = p.user_id
WHERE f.follower_id = 5
ORDER BY p.date_created;
