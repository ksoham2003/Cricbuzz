#  Series Management Module

## Module Owner

**Soham Kadam**

---

# Overview

The Series Management Module is the foundation of the CricBuzz platform. Every team, player, match, and tournament activity belongs to a particular series.

This module allows administrators to create, manage, update, publish, archive, and monitor cricket tournaments and series.

Examples:

* IPL 2026
* World Cup 2027
* Champions Trophy 2026
* College Premier League

---

# Responsibilities

### Core Features

* Create Series
* Update Series
* Delete Series
* View Series
* Search Series
* Filter Series
* Activate/Deactivate Series
* Publish Series
* Archive Completed Series

---

# Module Structure

```bash
src/modules/series/

├── series.model.js
├── series.repository.js
├── series.service.js
├── series.controller.js
├── series.routes.js
├── series.validator.js
└── series.interface.js
```

---

# Database Schema

## Series Collection

```javascript
{
  _id: ObjectId,

  name: String,

  shortName: String,

  description: String,

  format: String,

  startDate: Date,

  endDate: Date,

  totalTeams: Number,

  status: String,

  isDeleted: Boolean,

  createdBy: ObjectId,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Mongoose Model

```javascript
const seriesSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  shortName: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String
  },

  format: {
    type: String,
    enum: [
      "T10",
      "T20",
      "ODI",
      "TEST"
    ],
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  totalTeams: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      "UPCOMING",
      "ONGOING",
      "COMPLETED",
      "CANCELLED"
    ],
    default: "UPCOMING"
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{
  timestamps: true
});
```

---

# Business Rules

### Series Name

Must be unique.

Examples:

```text
Indian Premier League 2026
World Cup 2027
Champions Trophy 2026
```

---

### Date Validation

```javascript
if(startDate > endDate){
   throw Error(
      "Start date cannot be after end date"
   );
}
```

---

### Status Rules

| Status    | Description             |
| --------- | ----------------------- |
| UPCOMING  | Series not started      |
| ONGOING   | Series currently active |
| COMPLETED | Series finished         |
| CANCELLED | Series cancelled        |

---

### Delete Restrictions

A series cannot be deleted if:

* Matches exist
* Teams are assigned
* Tournament is active

Use Soft Delete instead.

```javascript
isDeleted = true;
```

---

# API Endpoints

---

## Create Series

### Request

```http
POST /api/series
```

### Authorization

```text
SUPER_ADMIN
ADMIN
```

### Request Body

```json
{
  "name": "Indian Premier League 2026",

  "shortName": "IPL2026",

  "description": "Professional T20 League",

  "format": "T20",

  "startDate": "2026-03-20",

  "endDate": "2026-05-30"
}
```

### Success Response

```json
{
  "success": true,

  "message": "Series created successfully",

  "data": {
    "_id": "123"
  }
}
```

---

## Get All Series

### Request

```http
GET /api/series
```

### Query Parameters

```http
?page=1
&limit=10
&status=ONGOING
```

### Response

```json
{
  "success": true,

  "count": 5,

  "data": []
}
```

---

## Get Series By ID

### Request

```http
GET /api/series/:id
```

---

## Update Series

### Request

```http
PATCH /api/series/:id
```

### Body

```json
{
  "name": "IPL 2026 Updated",

  "status": "ONGOING"
}
```

---

## Delete Series

### Request

```http
DELETE /api/series/:id
```

### Action

Soft Delete

```javascript
{
  isDeleted: true
}
```

---

# Validation Rules

## Create Series Validation

```javascript
{
  name: required,

  shortName: required,

  format:
    T10
    T20
    ODI
    TEST,

  startDate: required,

  endDate: required
}
```

---

# Repository Layer

### Functions

```javascript
createSeries()

getSeriesById()

getAllSeries()

updateSeries()

deleteSeries()

findSeriesByName()
```

Responsibilities:

* Database Operations
* Query Execution
* Pagination

---

# Service Layer

### Functions

```javascript
createSeries()

fetchSeries()

updateSeries()

removeSeries()
```

Responsibilities:

* Business Rules
* Validation
* Error Handling
* Duplicate Checks

---

# Controller Layer

### Functions

```javascript
createSeriesController()

getSeriesController()

getSeriesByIdController()

updateSeriesController()

deleteSeriesController()
```

Responsibilities:

* Handle Request
* Call Services
* Return Responses

---

# Search & Filtering

## Search

```http
GET /api/series?search=IPL
```

---

## Filter By Status

```http
GET /api/series?status=ONGOING
```

---

## Pagination

```http
GET /api/series?page=1&limit=10
```

---

# Error Handling

## Series Already Exists

```json
{
  "success": false,
  "message": "Series already exists"
}
```

---

## Invalid Date Range

```json
{
  "success": false,
  "message": "Invalid date range"
}
```

---

## Series Not Found

```json
{
  "success": false,
  "message": "Series not found"
}
```

---

# Frontend Pages

### Series List

Features:

* Search
* Filters
* Pagination
* Actions

---

### Create Series

Fields:

* Name
* Short Name
* Description
* Format
* Start Date
* End Date

---

### Edit Series

* Update Details
* Change Status

---

# Testing Checklist

* [ ] Create Series
* [ ] Update Series
* [ ] Delete Series
* [ ] Get Series By ID
* [ ] Search Series
* [ ] Filter Series
* [ ] Pagination
* [ ] Duplicate Name Validation
* [ ] Date Validation
* [ ] Authorization Check

---

# Git Commit Standards

```bash
feat(series): create series model

feat(series): add create series API

feat(series): implement series listing

feat(series): add pagination support

feat(series): add filtering support

fix(series): validate date range

fix(series): prevent duplicate series
```

---

# Definition of Done

✅ Database Schema Created

✅ CRUD APIs Completed

✅ Validation Implemented

✅ Pagination Working

✅ Search Working

✅ Filtering Working

✅ Soft Delete Implemented

✅ Authorization Added

✅ Postman Tested

✅ Frontend Integrated

✅ Code Reviewed

✅ Merged To Main Branch

---

# Future Enhancements

* Tournament Brackets
* Points Table Generation
* Series Analytics Dashboard
* Match Statistics
* Team Rankings
* Trophy Management
* Auto Scheduling Engine
* Multi-Series Support
