# 👤 User Management Module

## Module Owner

**Soham Kadam**

---

# Overview

The User Management Module is responsible for managing all platform users.

Only **SUPER_ADMIN** users can perform User CRUD operations.

This module allows the SUPER_ADMIN to:

* Create Users
* View Users
* Update Users
* Delete Users
* Assign Roles
* Activate/Deactivate Accounts

The module works together with:

* Authentication Module
* Authorization Module
* Role-Based Access Control (RBAC)

---

# Responsibilities

### Core Features

* Create User
* View User
* Update User
* Delete User
* Role Management
* User Search
* User Filtering
* User Status Management

---

# Access Control

## Allowed Roles

```text
SUPER_ADMIN
```

Only SUPER_ADMIN can access any endpoint in this module.

---

# Module Structure

```bash
src/modules/users/

├── user.model.js
├── user.repository.js
├── user.service.js
├── user.controller.js
├── user.routes.js
├── user.validator.js
└── user.interface.js
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

  status: String,

  isDeleted: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Mongoose Model

```javascript
const userSchema = new mongoose.Schema(
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

  status: {
    type: String,
    enum: [
      "ACTIVE",
      "INACTIVE"
    ],
    default: "ACTIVE"
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});
```

---

# User Roles

| Role        | Permissions                     |
| ----------- | ------------------------------- |
| SUPER_ADMIN | Full System Access              |
| ADMIN       | Series, Teams, Players, Matches |
| SCORER      | Live Match Operations           |

---

# Business Rules

## Email Must Be Unique

```javascript
if(emailExists){
   throw Error(
      "Email already registered"
   );
}
```

---

## Password Must Be Hashed

```javascript
bcrypt.hash(
   password,
   10
);
```

---

## Soft Delete

Users should never be permanently deleted.

```javascript
{
  isDeleted: true
}
```

---

## Prevent Self Deletion

```javascript
if(req.user.id === targetUser.id){
   throw Error(
      "Cannot delete yourself"
   );
}
```

---

# API Endpoints

---

## Create User

### Request

```http
POST /api/users
```

### Authorization

```text
SUPER_ADMIN
```

### Request Body

```json
{
  "name": "John Doe",

  "email": "john@example.com",

  "password": "password123",

  "role": "ADMIN"
}
```

### Success Response

```json
{
  "success": true,

  "message": "User created successfully"
}
```

---

## Get All Users

### Request

```http
GET /api/users
```

### Query Params

```http
?page=1
&limit=10
&role=ADMIN
```

---

### Response

```json
{
  "success": true,

  "count": 10,

  "data": []
}
```

---

## Get User By ID

### Request

```http
GET /api/users/:id
```

---

## Update User

### Request

```http
PATCH /api/users/:id
```

### Body

```json
{
  "name": "Updated User",

  "role": "SCORER",

  "status": "ACTIVE"
}
```

---

## Delete User

### Request

```http
DELETE /api/users/:id
```

### Action

```javascript
{
  isDeleted: true
}
```

---

# Validation Rules

## Create User Validation

```javascript
{
  name: required,

  email: required,

  password: min 6 chars,

  role:
    SUPER_ADMIN
    ADMIN
    SCORER
}
```

---

## Update User Validation

```javascript
{
  name: optional,

  role: optional,

  status: optional
}
```

---

# Repository Layer

### Functions

```javascript
createUser()

findUserById()

findUserByEmail()

findUsers()

updateUser()

deleteUser()
```

Responsibilities:

* Database Operations
* Search Queries
* Pagination

---

# Service Layer

### Functions

```javascript
createUser()

getUsers()

updateUser()

removeUser()
```

Responsibilities:

* Password Hashing
* Business Rules
* Validation
* Duplicate Email Checks

---

# Controller Layer

### Functions

```javascript
createUserController()

getUsersController()

getUserController()

updateUserController()

deleteUserController()
```

Responsibilities:

* Handle Requests
* Call Services
* Return Responses

---

# Search & Filters

## Search By Name

```http
GET /api/users?search=soham
```

---

## Filter By Role

```http
GET /api/users?role=ADMIN
```

---

## Filter By Status

```http
GET /api/users?status=ACTIVE
```

---

# Error Handling

## Email Already Exists

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## User Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## Cannot Delete Yourself

```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

---

# Frontend Pages

## User List

Features:

* Search
* Filters
* Pagination
* Role Badge
* Status Badge

---

## Create User

Fields:

* Name
* Email
* Password
* Role

---

## Edit User

Fields:

* Name
* Role
* Status

---

## User Details

Display:

* User Information
* Role
* Account Status
* Created Date

---

# Testing Checklist

* [ ] Create User
* [ ] Update User
* [ ] Delete User
* [ ] Search User
* [ ] Filter User
* [ ] Pagination
* [ ] Email Validation
* [ ] Password Hashing
* [ ] Role Validation
* [ ] Authorization Check

---

# Git Commit Standards

```bash
feat(users): create user schema

feat(users): add create user API

feat(users): implement user listing

feat(users): add role management

fix(users): validate duplicate email

fix(users): prevent self deletion
```

---

# Definition of Done

✅ User Schema Created

✅ CRUD APIs Completed

✅ Password Hashing Implemented

✅ Search Working

✅ Filters Working

✅ Pagination Working

✅ Soft Delete Implemented

✅ Role Management Added

✅ Authorization Added

✅ Postman Tested

✅ Frontend Integrated

✅ Code Reviewed

✅ Merged To Main Branch

---

# Future Enhancements

* User Activity Logs
* User Login History
* Audit Trail
* Bulk User Import
* Bulk User Export
* Two-Factor Authentication (2FA)
* Account Lockout Policy
* User Analytics Dashboard
