
# Swipebop

SwipeBop is an interactive, Tinder-like fashion discovery platform designed for Shopbop by Amazon. It provides a fun, personalized, and engaging shopping experience where users can swipe through outfits, discover their personal style, and get tailored recommendations based on their preferences.

# Repository
```
https://github.com/arushi-dodhia/SwipeBop
```

# Deployed Website
```
https://swipebop.com/
```

# Setup

## Frontend
Clone the Repository
```
https://github.com/arushi-dodhia/SwipeBop.git
```

Install Dependencies and Run Server
```
npm install
npm start
```

## Backend
Currently running on a Flask Server on an EC-2 instance.

To run our flask server locally:
```
cd Backend
pip install -r requirements.txt
python3 app.py
```

You can test our local flask server by sending requests to it locally using Postman or Browser.

# Overview
Swipebop allows users to shop for entire outfits at once with ease, removing the need for multiple websites and tables open, ensuring a memorable and fun experience as opposed to the current monotonous and overwhelming online shopping experience.

Frontend is developed in React.JS, with core features such as Swiping (liking and discard) and Saving outfits making API calls to the Backend EC-2 server running a Python Flask app.

## Core Features

### Authentication
* User Authentication setup through AWS Cognito.
* User Account required to use all features (Saving Liked and Discarded Items, Saving Outfits)

### Swiping
* Users are able to swipe on individual items or entire outfits.
* Liked and Discard tables in DynamoDB to store user data.
* Each time an individual item is liked or discarded, API calls to EC-2 instance access the tables and update them accordingly.
* Wishlist and Discard Pile buttons show modals containing user data for liked and discarded items respectively using API calls to the EC-2 instance.

### Outfits
* Outfits database stored in DynamoDB.
* Each time an outfit is saved or removed, DynamoDB table is called using Flask app.

### Reccomendation Engine
* Developed in Python that provides logged-in users personalized recommendations
* Uses image embeddings and metadata regarding liked products via MobileNet.
* Suggests similar items on top of the latest Shopbop catalog.

### Contact Us
* Service setup through Email.JS, all messages sent to our inbox.

# What Works
* Liking / Discarding items
* Restoring + Removing liked and discarded items.
* Swiping on individual items + entire outfits.
* Saving outfits to closet and features to clear closet.
* Touch Swiping on mobile devices.
* Recommending outfits based on current liked items.
* User Authentication (Login, Logout, Register, Forgot Password)
* Contact Us email services.

# What Doesn't
* Some pages are not fully responsive across all devices.
* Recommending outfits on page render doesn't apply to all liked items.
* No functionality to save outfits or like and discard items and being able to view them if not logged in (No Guest Account feature)

# Future Work
* Being able to use recommendation engine to generate better recommendations.
* Guest Account implementation.
* Ability to filter clothing items displayed.

# Contributors  

Meet the team behind SwipeBop! 🚀  

| Name | GitHub | Role |
|------|--------|------|
| **Anay Baheti** | (https://github.com/Anay704) | Backend Development |
| **Arushi Dodhia** | (https://github.com/arushi-dodhia) | Frontend Development |
| **Ziyuan Xue** | () | UI/UX Designer |
| **Raihan Tanvir** | (https://github.com/nabitanvir) | Backend Development |
| **Ryan Rumao** | (https://github.com/rrumao) | Full-Stack Development |
