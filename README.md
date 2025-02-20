# 🛍️ SwipeBop - The Tinder for Fashion Discovery  

## 📌 Project Overview  
SwipeBop is an **interactive, Tinder-like fashion discovery platform** designed for **Shopbop by Amazon**. It provides a **fun, personalized, and engaging shopping experience** where users can swipe through outfits, discover their personal style, and get tailored recommendations based on their preferences.

---

## 🚀 Features  
- **🔥 Swipe to Discover** – Swipe right to like an outfit, left to skip.
- **🤖 AI-Powered Recommendations** – Get personalized suggestions based on swipes.  
- **📌 Recently Viewed & Saved Items** – Store previous outfits for easy reference.  
- **🔗 Shopbop API Integration** – Fetch and display live product data from Shopbop.  
- **🌐 Serverless Architecture** – Leveraging AWS services for scalability and efficiency.  

---

## 🏗️ Architecture Overview  
SwipeBop follows a **serverless, cloud-native approach** leveraging **AWS services**:

1️⃣ **Frontend**: React.js (Hosted on AWS Amplify)  
2️⃣ **Backend**: Node.js with Express.js (Hosted on AWS Lambda)  
3️⃣ **Database**: DynamoDB for fast, scalable storage  
4️⃣ **Compute**: AWS EC2 for backend processing (alternative to serverless Lambda)  
5️⃣ **API Gateway**: Handles HTTP requests, routing to Lambda functions  

### **AWS Services Used**  
| **Service** | **Purpose** |
|------------|------------|
| **EC2** | Hosts backend services if not using serverless (Lambda). Manages persistent API services. |
| **DynamoDB** | NoSQL database for storing user interactions, liked items, and recommendations. |
| **Lambda** | Serverless execution of backend logic triggered by API Gateway. |
| **API Gateway** | Manages API requests from the frontend to backend services. |
| **Amplify** | Hosting and deployment for frontend UI. |

---

## 🛠️ Tech Stack  
- **Frontend**: React.js, Tailwind CSS, AWS Amplify  
- **Backend**: Node.js, Express.js, Python, AWS Lambda  
- **Database**: AWS DynamoDB  
- **APIs**: Shopbop API for fetching fashion products   

---

## Getting Started 

---

## 📅 Roadmap  

🔹 **Phase 1:** Basic UI & swipe feature 
🔹 **Phase 2:** AWS Lambda integration & API Gateway   
🔹 **Phase 3:** Implement user authentication & database storage 
🔹 **Phase 4:** Final testing & deployment   

---

## 🛠️ Contributors  

Meet the **talented team** behind SwipeBop! 🚀  

| Name | GitHub | Role |
|------|--------|------|
| **Anay Baheti** | (https://github.com/Anay704) | Backend Development |
| **Arushi Dodhia** | (https://github.com/arushi-dodhia) | Frontend Development |
| **Ziyuan Xue** | () | UI/UX Designer |
| **Raihan Tanvir** | (https://github.com/nabitanvir) | Backend Development |
| **Ryan Rumao ** | (https://github.com/ryan-24-7) | Backend Development |


---

