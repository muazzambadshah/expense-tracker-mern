# Expense Tracker

Full-stack expense tracker with JWT authentication: register/login and manage personal expenses through a REST API backed by MongoDB.

## Features
- User registration and login (bcrypt + JWT)
- Create, list, update and delete expenses
- Each user can only access their own expenses
- Simple HTML/CSS/JS dashboard

## Tech Stack
Node.js, Express 5, MongoDB/Mongoose, JWT, bcrypt, HTML/CSS/JavaScript

## Getting Started
```bash
git clone https://github.com/muazzambadshah/expense-tracker-mern.git
cd expense-tracker-mern/backend
npm install
copy .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm start                   # API on http://localhost:5000
```
Open `frontend/login.html` in the browser.

## Screenshots
_Screenshots coming soon._

## Author
**Muazzam Badshah** - AI Researcher, NCAI (NUST), Islamabad
[Portfolio](https://muazzam-portfolio-2wk1.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/muazzam-badshah-338881381) | [GitHub](https://github.com/muazzambadshah)
