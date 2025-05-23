# NavAble 🧭

NavAble is a full-stack web application designed to manage and explore places with detailed facility and accessibility information. It features an Admin Dashboard for managing place approvals, supports photo uploads, and offers a Map View to locate places.

---

## Project Structure

```bash
NavAble/
├── client/ # React frontend application
├── server/ # Express backend API with MongoDB
├── .gitignore # Git ignore rules
├── README.md # This file
```

---

## Features

- Admin Dashboard for managing pending and rejected places
- Approve or reject places submitted by users
- View places on a map
- Upload photos as proof for places
- Role-based authentication (admin access)
- Full MERN stack (MongoDB, Express, React, Node.js)

---

## Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB (local or cloud instance)

---

## How to Download and Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/murugappan18/NavAble.git
cd NavAble 
```

### 2. Backend Setup (server)
```bash
cd server
npm install
```

### 3. Create a .env file in server/ with the following content:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then run:
```bash
npm run server
```
This will start your Express server on http://localhost:5000.

### 4. Frontend Setup (client)
Open a new terminal and run:
```bash
cd client
npm install
```

### 5. Create a .env file in client/ with the following content:
```bash
REACT_APP_BASE_URL=http://localhost:5000/api
REACT_APP_IMAGE_URL=http://localhost:5000
```

Then run:
```bash
npm start
```
This will start the React frontend at http://localhost:3000.
