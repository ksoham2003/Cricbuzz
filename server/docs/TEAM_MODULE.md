# 👥 Team Management Module

## Module Owner

**Soham Kadam / Team Management Developer**

---

# Overview

The Team Management Module is responsible for creating and managing cricket teams participating in a series or tournament.

Every team belongs to a specific series and can have multiple players assigned to its squad.

Examples:

* Mumbai Indians
* Chennai Super Kings
* Royal Challengers Bangalore
* Team Alpha
* Team Bravo

This module acts as a bridge between:

* Series Module
* Player Module
* Squad Module
* Match Module

---

# Responsibilities

### Core Features

* Create Team
* Update Team
* Delete Team
* View Team Details
* List Teams
* Assign Team To Series
* Team Logo Management
* Team Color Management
* Team Statistics

---

# Module Structure

```bash
src/modules/team/

├── team.model.js
├── team.repository.js
├── team.service.js
├── team.controller.js
├── team.routes.js
├── team.validator.js
└── team.interface.js
```

---

# Database Schema

## Team Collection

```javascript
{
  _id: ObjectId,

  name: String,

  shortName: String,

  logo: String,

  primaryColor: String,

  secondaryColor: String,

  city: String,

  coach: String,

  captain: ObjectId,

  seriesId: ObjectId,

  totalMatches: Number,

  wins: Number,

  losses: Number,

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
const teamSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  shortName: {
    type: String,
    required: true,
    uppercase: true
  },

  logo: {
    type: String
  },

  primaryColor: {
    type: String
  },

  secondaryColor: {
    type: String
  },

  city: {
    type: String
  },

  coach: {
    type: String
  },

  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  },

  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Series",
    required: true
  },

  totalMatches: {
    type: Number,
    default: 0
  },

  wins: {
    type: Number,
    default: 0
  },

  losses: {
    type: Number,
    default: 0
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

# Business Rules

## Team Name Must Be Unique

Allowed:

```text
Mumbai Indians
Chennai Super Kings
Team Alpha
```

Not Allowed:

```text
Mumbai Indians
Mumbai Indians
```

within the same series.

---

## Team Must Belong To A Series

```javascript
if(!seriesExists){
   throw Error(
      "Series not found"
   );
}
```

---

## Team Cannot Be Deleted If Matches Exist

```javascript
if(teamMatches > 0){
   throw Error(
      "Team has scheduled matches"
   );
}
```

Use Soft Delete instead.

---

# API Endpoints

---

## Create Team

### Request

```http
POST /api/teams
```

### Authorization

```text
SUPER_ADMIN
ADMIN
```

### Request Body

```json
{
  "name": "Mumbai Indians",

  "shortName": "MI",

  "city": "Mumbai",

  "coach": "Mahela Jayawardene",

  "seriesId": "684b6a34c2fdb6f62f73d781"
}
```

### Success Response

```json
{
  "success": true,

  "message": "Team created successfully",

  "data": {}
}
```

---

## Get All Teams

### Request

```http
GET /api/teams
```

### Query Params

```http
?page=1
&limit=10
&seriesId=123
```

---

## Get Team By ID

### Request

```http
GET /api/teams/:id
```

### Response

```json
{
  "_id": "123",

  "name": "Mumbai Indians",

  "shortName": "MI",

  "city": "Mumbai",

  "wins": 5,

  "losses": 2
}
```

---

## Update Team

### Request

```http
PATCH /api/teams/:id
```

### Body

```json
{
  "coach": "New Coach",

  "status": "ACTIVE"
}
```

---

## Delete Team

### Request

```http
DELETE /api/teams/:id
```

### Action

```javascript
{
  isDeleted: true
}
```

---

# Logo Upload

## Upload Endpoint

```http
POST /api/teams/:id/logo
```

### Supported Formats

```text
PNG
JPG
JPEG
SVG
```

### Max Size

```text
5 MB
```

---

# Validation Rules

## Create Team Validation

```javascript
{
  name: required,

  shortName: required,

  city: required,

  seriesId: required
}
```

---

## Short Name Rules

Allowed:

```text
MI
CSK
RCB
KKR
```

Maximum:

```text
5 Characters
```

---

# Repository Layer

### Functions

```javascript
createTeam()

findTeamById()

findAllTeams()

updateTeam()

deleteTeam()

findTeamByName()
```

Responsibilities:

* Database Operations
* Pagination
* Search Queries

---

# Service Layer

### Functions

```javascript
createTeam()

fetchTeams()

updateTeam()

removeTeam()
```

Responsibilities:

* Validation
* Business Rules
* Duplicate Checks
* Series Verification

---

# Controller Layer

### Functions

```javascript
createTeamController()

getTeamsController()

getTeamByIdController()

updateTeamController()

deleteTeamController()
```

Responsibilities:

* Request Handling
* Response Formatting
* Error Management

---

# Search & Filters

## Search Team

```http
GET /api/teams?search=mumbai
```

---

## Filter By Series

```http
GET /api/teams?seriesId=123
```

---

## Filter By Status

```http
GET /api/teams?status=ACTIVE
```

---

# Statistics

Each team maintains:

```javascript
{
  totalMatches: 20,

  wins: 15,

  losses: 5
}
```

Win Percentage:

```javascript
(wins / totalMatches) * 100
```

---

# Common Errors

## Team Already Exists

```json
{
  "success": false,
  "message": "Team already exists"
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

## Team Not Found

```json
{
  "success": false,
  "message": "Team not found"
}
```

---

## Team Has Scheduled Matches

```json
{
  "success": false,
  "message": "Cannot delete team with scheduled matches"
}
```

---

# Frontend Pages

## Team List

Features:

* Search
* Filters
* Pagination
* Team Statistics

---

## Create Team

Fields:

* Team Name
* Short Name
* City
* Coach
* Logo
* Series

---

## Edit Team

Features:

* Update Team Details
* Change Coach
* Upload Logo

---

## Team Details

Display:

* Team Information
* Captain
* Statistics
* Squad Count

---

# Testing Checklist

* [ ] Create Team
* [ ] Update Team
* [ ] Delete Team
* [ ] Upload Logo
* [ ] Search Team
* [ ] Filter Team
* [ ] Pagination
* [ ] Duplicate Validation
* [ ] Series Validation
* [ ] Authorization Check

---

# Git Commit Standards

```bash
feat(team): create team schema

feat(team): add create team API

feat(team): implement team listing

feat(team): add team logo upload

feat(team): implement team statistics

fix(team): validate duplicate team names

fix(team): prevent deleting active teams
```

---

# Definition of Done

✅ Team Schema Created

✅ CRUD APIs Completed

✅ Logo Upload Working

✅ Search Working

✅ Filters Working

✅ Pagination Working

✅ Statistics Added

✅ Soft Delete Implemented

✅ Authorization Added

✅ Postman Tested

✅ Frontend Integrated

✅ Code Reviewed

✅ Merged To Main Branch

---

# Future Enhancements

* Team Owner Management
* Team Sponsors
* Team Social Media Links
* Team Ranking System
* Team Performance Analytics
* Team Achievements
* Team History Timeline
* AI Team Insights
