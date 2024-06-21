# Roamr

Roamr is a social media application that allows users to share their travel experiences by posting their location and an image. Users can explore posts from around the world on an interactive globe.

## Features

- **Login/Signup**: Users can sign up for an account and then use the same account to log in.
- **Search for users**: Users can search for other users on the platform using their username.
- ~~**Post Creation**: Users can create posts by providing a city, country, description, and an image.~~ Not implemented yet
- ~~**Followers:** Users can follow others on the platform.~~ Not implemented yet
- ~~**Interactive Globe**: Users can view posts on a 3D interactive globe and explore locations based on who they follow.~~ Not implemented yet
- ~~**User Profiles**: Users have their profiles where they can see all their posts.~~ Not implemented yet

## Getting Started

### Prerequisites

Make sure you have [Docker](https://www.docker.com/) installed and running.

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/danielyedaniel/Roamr.git
    cd Roamr
    ```

2. **Run the application**:

    - Build and start the Docker containers:

        ```sh
      docker-compose up
        ```

### Usage

1. Open your web browser and go to `localhost:3000`.
2. Sign up or log in to your account.
3. Search for other users on the platform.
4. ~~Create a new post by clicking the "New Post" button.~~
5. ~~Fill in the country, city, description, and upload an image.~~
6. ~~Click "Post" to share your experience.~~
7. ~~Search for other users and follow them.~~
8. ~~Explore the globe to see posts from other users you follow.~~

## How It's Built

- **Frontend**: The frontend is developed with ReactJS. We use a third-party library for the interactive 3D globe.
- **Backend**: The backend is built with Go and serves to handle API requests from our frontend. It also uses GORM to interact with our database.
- **Database**: PostgreSQL is used as the database.
- **Dockerized**: The application is containerized using Docker. Running `docker-compose up` will start both the frontend and backend services and a local PostgreSQL database.

## Database

All SQL scripts are located within the `sql_scripts` directory. The `create_tables.sql` script is responsible for creating the necessary tables. The `init.sql` script populates all the tables with initial sample data. Additionally, there are five other query scripts in the `sql_scripts` directory:

- `check_username_or_email.sql`: This SQL file checks if a username or email has already been taken. It returns all users that use the username or email.
- `find_following.sql`: This SQL file finds all the users that a certain userID is following. It returns all users that this user follows.
- `find_posts_from_following.sql`: This SQL file finds all the posts from all the users they are following given a userID. It returns all posts that should show up in their feed.
- `login.sql`: This SQL file checks if a username and hashed password match a user within the DB. It returns all users that match the username and password.
- `search_users.sql`: This SQL file returns all users that begin with a certain string. It returns all users that have the string prefix.

The outputs of these queries are stored in the `sql_out` directory. Each output file has the same name as the corresponding SQL script but with a `.out` extension.

When you run `docker-compose up`, the database is set up and populated with the sample data, so no extra work is needed to set it up. The command mounts the sql_scripts directory, a volume inside the PostgreSQL container, automatically running the init.sql script. The init.sql script calls create_tables.sql to create the tables and then populates them with data from the `data` directory.
