#!/bin/sh

mkdir -p ./production_sql_out

docker exec -it roamr-postgres-1 mkdir -p /tmp/sql_out

# Run all create scripts first
for script in ./production_sql_scripts/create_*.sql; do
  script_name=$(basename $script .sql)
  docker exec -it roamr-postgres-1 psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/production_sql_scripts/$script_name.sql -o /tmp/sql_out/$script_name.out
  docker cp roamr-postgres-1:/tmp/sql_out/$script_name.out ./production_sql_out/$script_name.out
done

# Run all other scripts (excluding create and delete scripts)
for script in ./production_sql_scripts/*.sql; do
  script_name=$(basename $script .sql)
  if [[ $script_name != create_* && $script_name != delete_* ]]; then
    docker exec -it roamr-postgres-1 psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/production_sql_scripts/$script_name.sql -o /tmp/sql_out/$script_name.out
    docker cp roamr-postgres-1:/tmp/sql_out/$script_name.out ./production_sql_out/$script_name.out
  fi
done

# Run all delete scripts last
for script in ./production_sql_scripts/delete_*.sql; do
  script_name=$(basename $script .sql)
  docker exec -it roamr-postgres-1 psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/production_sql_scripts/$script_name.sql -o /tmp/sql_out/$script_name.out
  docker cp roamr-postgres-1:/tmp/sql_out/$script_name.out ./production_sql_out/$script_name.out
done
