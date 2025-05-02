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
Clone the Repository
```
https://github.com/arushi-dodhia/SwipeBop.git
```

Install Dependencies and Run Server
```
npm install
npm start
```
---

## 🚀 Features  
- **🔥 Swipe to Discover** – Swipe right to like an outfit, left to skip.
- **🤖 AI-Powered Recommendations** – Get personalized suggestions based on swipes.  
- **📌 Recently Viewed & Saved Items** – Store previous outfits for easy reference.  
- **🔗 Shopbop API Integration** – Fetch and display live product data from Shopbop.  
- **🌐 Serverless Architecture** – Leveraging AWS services for scalability and efficiency.  

---

## Architecture Overview  
SwipeBop follows a **serverless, cloud-native approach** leveraging **AWS services**:

1️⃣ **Frontend**: React.js  
2️⃣ **Backend**: Python                       
3️⃣ **Database**: DynamoDB for fast, scalable storage  
4️⃣ **Compute**: AWS EC2 for backend processing

---

## 🛠️ Tech Stack  
- **Frontend**: React.js
- **Backend**: Python (Flask)
- **Database**: AWS DynamoDB  
- **APIs**: Shopbop API for fetching fashion products, REST API built for accessing DynamoDB Tables.

---

## AWS Architecture for SwipeBop

SwipeBop is built on a **serverless, cloud-native** infrastructure leveraging AWS services:

### **🚀 AWS Services Used**
| Service       | Purpose |
|--------------|---------|
| **EC2**      | Hosts backend services if not using Lambda. Useful for managing persistent API services. |
| **DynamoDB** | NoSQL database for storing user interactions, liked items, and recommendations. |
| **API Gateway** | Manages API requests between frontend and backend services. |
| **Amplify**  | Hosting and deployment for frontend UI. |


---

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

