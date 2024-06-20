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
        "locationID": i,
        "latitude": float(fake.latitude()),
        "longitude": float(fake.longitude()),
        "country": fake.country(),
        "city": fake.city()
    }
    locations_data.append(location)

with open('locations_100.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=locations_data[0].keys())
    writer.writeheader()
    writer.writerows(locations_data)


def generate_base64_image():
    image = Image.new('RGB', (100, 100), color = (73, 109, 137))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def generate_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_base64_profile_picture():
    image = Image.new('RGB', (100, 100), color = (123, 203, 56))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

# users data
users_data = []

for i in range(1, 101):
    user = {
        "userID": i,
        "email": fake.email(),
        "username": fake.user_name(),
        "passwordHash": generate_password_hash(fake.password()),
        "profilePicture": generate_base64_profile_picture(),
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "dateCreated": fake.date_this_decade().isoformat()
    }
    users_data.append(user)

with open('users_100.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=users_data[0].keys())
    writer.writeheader()
    writer.writerows(users_data)

# posts data
posts_data = []

for i in range(1, 1001):
    post = {
        "userID": random.randint(1, 100),
        "postID": i,
        "locationID": random.randint(1, 100),
        "description": fake.text(max_nb_chars=200),
        "commentsCount": random.randint(0, 1000),
        "image": generate_base64_image()
    }
    posts_data.append(post)

with open('posts_1000.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=posts_data[0].keys())
    writer.writeheader()
    writer.writerows(posts_data)

# comments data
comments_data = []

for i in range(1, 2001):  
    comment = {
        "commentID": i,
        "postID": random.randint(1, 1000),
        "userID": random.randint(1, 100),
        "content": fake.text(max_nb_chars=200)
    }
    comments_data.append(comment)

with open('comments_2000.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=comments_data[0].keys())
    writer.writeheader()
    writer.writerows(comments_data)

# follows data
follows_data = []

for i in range(1, 501):  
    followerID = random.randint(1, 100)
    followedID = random.randint(1, 100)
    while followerID == followedID:  
        followedID = random.randint(1, 100)
    
    follow = {
        "followerID": followerID,
        "followedID": followedID
    }
    
    if follow in follows_data:
        continue
    
    follows_data.append(follow)

with open('follows_500.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=follows_data[0].keys())
    writer.writeheader()
    writer.writerows(follows_data)
