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

## Architecture Overview  
SwipeBop follows a **serverless, cloud-native approach** leveraging **AWS services**:

1️⃣ **Frontend**: React.js  
2️⃣ **Backend**: Python                       
3️⃣ **Database**: DynamoDB for fast, scalable storage  
4️⃣ **Compute**: AWS EC2 for backend processing

---

## 🛠️ Tech Stack  
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Python  
- **Database**: AWS DynamoDB  
- **APIs**: Shopbop API for fetching fashion products   

---

## AWS Architecture for SwipeBop

SwipeBop is built on a **serverless, cloud-native** infrastructure leveraging AWS services:

### **🚀 AWS Services Used**
| Service       | Purpose |
|--------------|---------|
| **EC2**      | Hosts backend services if not using Lambda. Useful for managing persistent API services. |
| **DynamoDB** | NoSQL database for storing user interactions, liked items, and recommendations. |
| **Lambda**   | Serverless execution of backend logic, triggered by API Gateway. |
| **API Gateway** | Manages API requests between frontend and backend services. |
| **Amplify**  | Hosting and deployment for frontend UI. |

---

### **🏗 How AWS Services Work Together**
1. **API Gateway** receives requests from the front end.
2. **Lambda functions** process logic (e.g., fetching outfit recommendations).
3. **DynamoDB** stores and retrieves user swipe preferences.
4. **EC2** runs additional backend services for processing requests.
5. **Amplify** hosts the front-end React UI.

---

### **🛠 How to Set Up & Use AWS for SwipeBop**
#### **1️⃣ Setting Up DynamoDB**
- Create a **DynamoDB table** for storing user interactions.
- Define attributes like `user_id`, `outfit_id`, `liked_status`.

#### **2️⃣ Deploying Lambda Functions**
- Write Python-based **AWS Lambda** functions for handling requests.
- Connect Lambda to DynamoDB using **boto3**.

#### **3️⃣ Using API Gateway**
- Create RESTful endpoints to interact with the backend.
- Configure **CORS settings** to allow API calls from the front end.

#### **4️⃣ Hosting the Frontend**
- Deploy **React.js UI using AWS Amplify**.
  
---

## 📅 Roadmap  

🔹 **Phase 1:** Basic UI & swipe feature 
🔹 **Phase 2:** AWS Lambda integration & API Gateway   
🔹 **Phase 3:** Implement user authentication & database storage 
🔹 **Phase 4:** Final testing & deployment   

---

## 🛠️ Contributors  

Meet the **team** behind SwipeBop! 🚀  

| Name | GitHub | Role |
|------|--------|------|
| **Anay Baheti** | (https://github.com/Anay704) | Backend Development |
| **Arushi Dodhia** | (https://github.com/arushi-dodhia) | Frontend Development |
| **Ziyuan Xue** | () | UI/UX Designer |
| **Raihan Tanvir** | (https://github.com/nabitanvir) | Backend Development |
| **Ryan Rumao** | (https://github.com/ryan-24-7) | Backend Development |


---

