#!/bin/sh

mkdir -p ./sql_out

docker exec -it roamr-postgres-1 mkdir -p /tmp/sql_out

scripts=("check_username_or_email" "find_following" "find_posts_from_following" "login" "search_users")

for script in "${scripts[@]}"; do
  docker exec -it roamr-postgres-1 psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/sql_scripts/${script}.sql -o /tmp/sql_out/${script}.out
  docker cp roamr-postgres-1:/tmp/sql_out/${script}.out ./sql_out/${script}.out
done
