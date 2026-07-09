.

🍽️ FoodVerse AI - Smart Restaurant with AI Companion
📖 Project Overview

FoodVerse AI is an AI-powered restaurant application that allows customers to browse the menu, place food orders, and enjoy conversations with AI personalities while waiting for their food.

Unlike traditional restaurant applications, FoodVerse AI transforms waiting time into an engaging experience. After placing an order, customers enter an AI Lounge where they can chat with different AI personalities such as a Business Mentor, Chef, Best Friend, Fitness Coach, Story Teller, and more.

The application also provides real-time order tracking from confirmation until delivery or pickup
1.✨ Customer Features
🍴 Food Ordering
Browse Restaurant Menu
Search Food Items
Filter by Categories
View Food Details
Add Items to Cart
Update Quantity
Remove Items from Cart
Place Food Order
Order Confirmation Message
Live Order Status Tracking
2.AI Waiting Lounge
Once the customer places an order, the system displays:
✅ Your order has been confirmed.

Estimated Preparation Time: 20 Minutes.

While waiting, enjoy chatting with our AI Companions.
3.AI Personalities
Customers can switch between different AI companions.
| AI Role            | Purpose                           |
| ------------------ | --------------------------------- |
| 👨‍🍳 Master Chef  | Food suggestions and cooking tips |
| 💼 Business Mentor | Startup and career advice         |
| 🎓 Study Buddy     | Education and programming help    |
| 💪 Fitness Coach   | Health and fitness guidance       |
| 😂 Comedian        | Jokes and entertainment           |
| 📚 Story Teller    | Interactive storytelling          |
| 🎮 Gamer           | Gaming discussions                |
| 🌍 Travel Guide    | Travel recommendations            |
| 🎵 Music Lover     | Music discussions                 |
| 🤝 Best Friend     | Friendly conversations            |
Each personality has its own prompt so the responses feel unique.
4.🍔 Order Tracking
Customers can monitor every stage of their order.
Order Placed

↓

Order Confirmed

↓

Preparing Ingredients

↓

Cooking

↓

Packing

↓

Ready for Pickup / Out for Delivery

↓

Delivered
5.Admin Features
Secure Admin Login
Dashboard
Add Food Items
Update Food Details
Delete Food Items
Manage Categories
Upload Food Images
View Orders
Update Order Status
Manage Customers
Restaurant Analytics
Sales Reports
6.AI Features
🍽 Smart Food Recommendation

Example:

Suggest a spicy chicken meal under ₹300.

📍 Order Assistant

Example:

Where is my order?

AI:

Your order is currently being prepared.
Estimated time remaining: 8 minutes.

🌐 Multilingual Support
English
Telugu
Hindi
7.Technology Stack
Frontend
React.js
Tailwind CSS
Backend
FastAPI
Database
PostgreSQL
AI
Groq API
LangChain
Prompt Engineering
Authentication
JWT (Admin Only)
Storage
Cloudinary (Images)
🗄 Database Tables
Admins
MenuItems
Categories
Orders
OrderItems
Customers
OrderStatus
ChatSessions
ChatMessages
Personas
Reviews
8.Project Structure
FoodVerse-AI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── chat/
│   ├── cart/
│   ├── order-tracking/
│   ├── assets/
│   └── App.jsx
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── ai/
│   │   ├── database/
│   │   ├── models/
│   │   └── main.py
│
├── uploads/
├── prompts/
├── images/
├── README.md
└── requirements.txt
