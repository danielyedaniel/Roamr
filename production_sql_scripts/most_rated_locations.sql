SELECT L.*, COUNT(R.location_id) AS rating_count
FROM locations L
LEFT JOIN ratings R ON L.location_id = R.location_id
GROUP BY L.location_id
ORDER BY rating_count DESC
LIMIT 25;
