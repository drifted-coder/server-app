# Mini Helpdesk System --- Backend API

Node.js + Express + MongoDB backend for a lightweight Helpdesk /
Ticketing system with role-based access control.

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB + Mongoose
-   JWT Authentication
-   bcrypt Password Hashing

## Features

-   JWT Access + Refresh Token
-   Role-based Authorization
-   Ticket Management Workflow
-   Comments & Activity Logs
-   Search, Filter & Pagination

## Setup

### Install

npm install

### Run

npm run dev

### Environment Variables

PORT=8000 
MONGO_URI=mongodb+srv://ghosharunava57_db_user:k7hjuZvWDuoHXpmS@cluster0.kgn6xzf.mongodb.net/ticket_booking?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=superStrongAccessSecret_123
JWT_REFRESH_SECRET=superStrongRefreshSecret_456
