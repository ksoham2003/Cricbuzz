# 🔐 Authentication & Authorization Module

## Module Owner

**Soham Kadam**

---

# Overview

The Authentication & Authorization module is responsible for managing user registration, login, JWT token generation, password security, and role-based access control (RBAC).

This module acts as the security layer for the entire CricBuzz platform and ensures that only authorized users can access protected resources.

---

# Responsibilities

## Authentication

* User Registration
* User Login
* Password Hashing
* JWT Token Generation
* JWT Verification
* Protected Routes

## Authorization

* Role-Based Access Control (RBAC)
* SUPER_ADMIN Access
* ADMIN Access
* SCORER Access

---

# Supported Roles

| Role        | Permissions                            |
| ----------- | -------------------------------------- |
| SUPER_ADMIN | Full System Access                     |
| ADMIN       | Manage Series, Teams, Players, Matches |
| SCORER      | Live Match Operations Only             |

---

# Module Structure

```bash
src/modules/auth/

├── auth.controller.js
├── auth.service.js
├── auth.repository.js
├── auth.routes.js
├── auth.validator.js
├── auth.model.js
└── auth.interface.js
```

---

# Database Schema

## User Collection

```javascript
{
  _id: ObjectId,

  name: String,

  email: String,

  password: String,

  role: String,

  isDeleted: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

---

# User Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: [
      "SUPER_ADMIN",
      "ADMIN",
      "SCORER"
    ],
    default: "SCORER"
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}
```

---

# API Endpoints

## Register User

### Request

```http
POST /api/auth/register
```

### Body

```json
{
  "name": "Soham Kadam",
  "email": "soham@gmail.com",
  "password": "password123",
  "role": "ADMIN"
}
```

### Success Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "Soham Kadam",
    "email": "soham@gmail.com",
    "role": "ADMIN"
  }
}
```

---

## Login User

### Request

```http
POST /api/auth/login
```

### Body

```json
{
  "email": "soham@gmail.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "Soham Kadam",
    "email": "soham@gmail.com",
    "role": "ADMIN"
  }
}
```

---

# Validation Rules

## Registration Validation

```javascript
{
  name: min 3 chars

  email: valid email

  password: min 6 chars

  role:
    SUPER_ADMIN
    ADMIN
    SCORER
}
```

---

## Login Validation

```javascript
{
  email: valid email

  password: required
}
```

---

# Password Security

Passwords must never be stored in plain text.

Use bcrypt:

```javascript
bcrypt.hash(password, 10);
```

Password verification:

```javascript
bcrypt.compare(
  password,
  hashedPassword
);
```

---

# JWT Configuration

## Payload

```javascript
{
  id: user._id,

  email: user.email,

  role: user.role
}
```

## Generate Token

```javascript
jwt.sign(
  payload,
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);
```

---

# Middleware

## Authenticate Middleware

Responsibilities:

* Verify JWT
* Decode Token
* Attach User To Request
* Reject Invalid Tokens

```javascript
req.user = decodedUser;
```

---

## Authorize Middleware

Responsibilities:

* Check User Role
* Allow Access
* Reject Unauthorized Requests

Example:

```javascript
authorize(
  "SUPER_ADMIN",
  "ADMIN"
);
```

---

# Error Handling

## Common Errors

### Email Already Exists

```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Token Expired

```json
{
  "success": false,
  "message": "Token expired"
}
```

---

# Environment Variables

```env
JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

# Testing Checklist

* [ ] Register User
* [ ] Duplicate Email Validation
* [ ] Login User
* [ ] Wrong Password Validation
* [ ] JWT Token Generation
* [ ] JWT Verification
* [ ] Protected Routes
* [ ] Role Authorization
* [ ] Token Expiry Handling

---

# Git Commit Standards

```bash
feat(auth): create user model

feat(auth): implement registration API

feat(auth): implement login API

feat(auth): add JWT authentication

feat(auth): add role based authorization

fix(auth): handle duplicate email validation
```

---

# Definition of Done

* Registration Working
* Login Working
* Password Hashing Enabled
* JWT Authentication Working
* Authorization Middleware Working
* Validation Implemented
* Error Handling Added
* Postman Tested
* Code Reviewed
* Merged Into Main Branch
