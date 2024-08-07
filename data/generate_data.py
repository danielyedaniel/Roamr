import csv
from faker import Faker
import random
import base64
from PIL import Image
from io import BytesIO
import hashlib

fake = Faker()

# locations data
locations_data = []

for i in range(1, 101):
    location = {
        "location_id": i,
        "latitude": float(fake.latitude()),
        "longitude": float(fake.longitude()),
        "country": fake.country(),
        "city": fake.city()
    }
    locations_data.append(location)

with open('locations.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=locations_data[0].keys())
    writer.writeheader()
    writer.writerows(locations_data)


def generate_base64_image():
    image = Image.new('RGB', (100, 100), color=(73, 109, 137))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')


def generate_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


def generate_base64_profile_picture():
    image = Image.new('RGB', (100, 100), color=(123, 203, 56))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')


# users data
users_data = []

first_user = {
    "user_id": 1,
    "email": "danielye@gmail.com",
    "username": "DanielYee",
    "password_hash": "$2a$10$3dwzJ.USYxBNsnn7YfhvOu71cTyr2nV6fiel6HbBteJHgT3IAsW9u",  # password123
    "profile_picture": generate_base64_profile_picture(),
    "first_name": "Daniel",
    "last_name": "Ye",
    "date_created": fake.date_this_decade().isoformat()
}
users_data.append(first_user)

# Generate remaining users - 100
for i in range(2, 101):
    user = {
        "user_id": i,
        "email": fake.email(),
        "username": fake.user_name(),
        "password_hash": generate_password_hash(fake.password()),
        "profile_picture": generate_base64_profile_picture(),
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "date_created": fake.date_this_decade().isoformat()
    }
    users_data.append(user)

with open('users.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=users_data[0].keys())
    writer.writeheader()
    writer.writerows(users_data)

# posts data - 1000
posts_data = []

for i in range(1, 1001):
    post = {
        "user_id": random.randint(1, 100),
        "post_id": i,
        "location_id": random.randint(1, 100),
        "description": fake.text(max_nb_chars=200),
        "comments_count": random.randint(0, 1000),
        "image": generate_base64_image(),
        "date_created": fake.date_this_decade().isoformat()
    }
    posts_data.append(post)

with open('posts.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=posts_data[0].keys())
    writer.writeheader()
    writer.writerows(posts_data)

# comments data - 2000
comments_data = []

for i in range(1, 2001):
    comment = {
        "comment_id": i,
        "post_id": random.randint(1, 1000),
        "user_id": random.randint(1, 100),
        "content": fake.text(max_nb_chars=200),
        "date_created": fake.date_this_decade().isoformat()
    }
    comments_data.append(comment)

with open('comments.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=comments_data[0].keys())
    writer.writeheader()
    writer.writerows(comments_data)

# follows data - 500
follows_data = []

for i in range(1, 501):
    follower_id = random.randint(1, 100)
    followed_id = random.randint(1, 100)
    while follower_id == followed_id:
        followed_id = random.randint(1, 100)

    follow = {
        "follower_id": follower_id,
        "followed_id": followed_id
    }

    if follow in follows_data:
        continue

    follows_data.append(follow)

with open('follows.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=follows_data[0].keys())
    writer.writeheader()
    writer.writerows(follows_data)

# ratings data - 2000
ratings_data = []
existing_ratings = set()

while len(ratings_data) < 2000:
    user_id = random.randint(1, 100)
    location_id = random.randint(1, 100)
    rating = random.randint(1, 5)

    rating_record = (user_id, location_id)

    if rating_record in existing_ratings:
        continue

    existing_ratings.add(rating_record)
    ratings_data.append({
        "user_id": user_id,
        "location_id": location_id,
        "rating": rating,
        "review": fake.text(max_nb_chars=200),
        "date_created": fake.date_this_decade().isoformat()
    })

with open('ratings.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=["user_id", "location_id", "rating", "review", "date_created"])
    writer.writeheader()
    writer.writerows(ratings_data)
