# 🛍️ SwipeBop - The Tinder for Fashion Discovery  

## 📌 Project Overview  
SwipeBop is an **interactive, Tinder-like fashion discovery platform** designed for **Shopbop by Amazon**. It provides a **fun, personalized, and engaging shopping experience** where users can swipe through outfits, discover their personal style, and get tailored recommendations based on their preferences.

---

## Deployed Website
```
https://swipebop.com/
```

---

## Setup
### Frontend
Clone the Repository
```
https://github.com/arushi-dodhia/SwipeBop.git
```

Install Dependencies and Run Server
```
npm install
npm start
```

### Backend
Currently running on a Flask Server on an EC-2 instance.

To run our flask server locally:
```
cd Backend
pip install -r requirements.txt
python3 app.py
```

You can test our local flask server by sending requests to it locally using Postman or Browser.
---

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

---

## Architecture Overview  
SwipeBop follows a **server, cloud-native approach** leveraging **AWS services**:

1️⃣ **Frontend**: React.js  
2️⃣ **Backend**: Python                       
3️⃣ **Database**: DynamoDB for fast, scalable storage  
4️⃣ **Compute**: AWS EC2 for backend processing

---

## 🛠️ Tech Stack  
- **Frontend**: React.js
- **Backend**: Python (Flask)
- **Database**: AWS DynamoDB  
- **APIs**: Shopbop API for fetching fashion products, Custom REST API built for accessing DynamoDB Tables.

## 🛠️ Contributors  

Meet the **team** behind SwipeBop! 🚀  

| Name | GitHub | Role |
|------|--------|------|
| **Anay Baheti** | (https://github.com/Anay704) | Backend Development |
| **Arushi Dodhia** | (https://github.com/arushi-dodhia) | Frontend Development |
| **Ziyuan Xue** | () | UI/UX Designer |
| **Raihan Tanvir** | (https://github.com/nabitanvir) | Backend Development |
| **Ryan Rumao** | (https://github.com/rrumao) | Full-Stack Development |

---

