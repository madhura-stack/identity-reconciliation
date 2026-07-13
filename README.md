# Identity Reconciliation Backend

A backend service built using **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM** to reconcile customer identities based on their **email address** and **phone number**.

---

# 📌 Project Overview

This project implements an **Identity Reconciliation System** that determines whether an incoming customer belongs to an existing customer or is a new customer.

The application maintains relationships between **Primary Contacts** and **Secondary Contacts**. When two primary contacts are later found to represent the same customer, the application automatically merges them while preserving the oldest primary contact.

---

# 🚀 Features

* Identity reconciliation using **Email** and **Phone Number**
* Automatic creation of **Primary Contacts**
* Automatic creation of **Secondary Contacts**
* Automatic merging of duplicate identities
* REST API built with **Express.js**
* PostgreSQL database using **Sequelize ORM**
* Docker support
* Environment variable configuration using `.env`

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* Docker
* Postman
* Git & GitHub

---

# 📂 Project Structure

```text
identity-reconciliation/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── identifyController.js
│   │
│   ├── models/
│   │   └── Contact.js
│   │
│   ├── routes/
│   │   └── identifyRoutes.js
│   │
│   ├── services/
│   │   └── identifyService.js
│   │
│   ├── app.js
│   └── server.js
│
├── Dockerfile
├── .dockerignore
├── .env.example
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

# ✅ Prerequisites

Before running the project, make sure you have installed:

* Node.js
* PostgreSQL
* Docker Desktop
* Git
* Postman (for API testing)

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/madhura-stack/identity-reconciliation.git
```

## 2. Navigate to the Project

```bash
cd identity-reconciliation
```

## 3. Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DB_NAME=identity_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

# 🗄️ Database Setup

1. Open **pgAdmin**.
2. Create a new PostgreSQL database named:

```text
identity_db
```

3. Update your `.env` file with your PostgreSQL credentials.
4. Start the backend application.
5. Sequelize will automatically create the **Contacts** table.

---

# ▶️ Running the Application

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

The server will run at:

```text
http://localhost:3000
```

---

# 🐳 Docker

## Build Docker Image

```bash
docker build -t identity-reconciliation .
```

## Run Docker Container

```bash
docker run -d -p 3000:3000 --name identity-app \
-e PORT=3000 \
-e DB_HOST=host.docker.internal \
-e DB_PORT=5432 \
-e DB_USER=postgres \
-e DB_PASSWORD=your_password \
-e DB_NAME=identity_db \
identity-reconciliation
```

## Verify Running Container

```bash
docker ps
```

---

# 📡 API Endpoint

## POST `/identify`

```text
http://localhost:3000/identify
```

---

# 📥 Sample Request

```json
{
  "email": "john@gmail.com",
  "phoneNumber": "1111111111"
}
```

---

# 📤 Sample Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "john@gmail.com"
    ],
    "phoneNumbers": [
      "1111111111"
    ],
    "secondaryContactIds": []
  }
}
```

---

# 🧠 Identity Reconciliation Logic

The application follows these rules:

* If **no matching email or phone number** exists:

  * Create a **Primary Contact**.

* If **email or phone number already exists**:

  * Create a **Secondary Contact** linked to the Primary Contact.

* If **two different Primary Contacts** are found to belong to the same customer:

  * Keep the **oldest Primary Contact**.
  * Convert the newer Primary Contact into a **Secondary Contact**.
  * Update its `linkedId`.

* Return:

  * Primary Contact ID
  * All unique emails
  * All unique phone numbers
  * All secondary contact IDs

---

# 🧪 Testing

The API was tested using **Postman**.

### Test Cases

* ✅ New Contact
* ✅ Existing Contact
* ✅ Same Phone + New Email
* ✅ Same Email + New Phone
* ✅ Merge Two Primary Contacts

---

---

# 🔮 Future Improvements

* JWT Authentication
* Swagger API Documentation
* Unit Testing using Jest
* CI/CD using GitHub Actions
* Kubernetes Deployment
* Logging with Winston

---

# 👩‍💻 Author

**madhura-stack**

Backend Developer Project

---

