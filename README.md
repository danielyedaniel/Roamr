# Roamr

Roamr is a social media application that allows users to share their travel experiences by posting their location and an image. Users can explore posts from around the world on an interactive globe.

## Features

- **Post Creation**: Users can create posts by providing a city, country, description, and an image.
- **Followers:** Users can follow others on the platform.
- **Interactive Globe**: Users can view posts on a 3D interactive globe and explore locations based on who they follow.
- **User Profiles**: Users have their profiles where they can see all their posts.

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
3. Create a new post by clicking the "New Post" button.
4. Fill in the country, city, description, and upload an image.
5. Click "Post" to share your experience.
6. Search for other users and follow them.
7. Explore the globe to see posts from other users you follow.

## How It's Built

- **Frontend**: The frontend is developed with ReactJS. We use a third-party library for the interactive 3D globe.
- **Backend**: The backend is built with Go and serves to handle API requests from our frontend. It also uses GORM to interact with our database.
- **Database**: PostgreSQL is used as the database.
- **Dockerized**: The application is containerized using Docker. Running `docker-compose up` will start both the frontend and backend services and a local PostgreSQL database.

