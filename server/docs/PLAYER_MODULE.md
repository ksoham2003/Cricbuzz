# 🏏 Player Management Module

## Module Owner

**Rohit Pokhariya**

---

# Overview

The Player Management Module is responsible for managing all cricket players participating in tournaments and series.

Each player belongs to a team and can later be selected into a squad and Playing XI.

This module acts as the central player registry of the CricBuzz platform.

Examples:

* Virat Kohli
* Rohit Sharma
* Jasprit Bumrah
* MS Dhoni

---

# Responsibilities

### Core Features

* Create Player
* Update Player
* Delete Player
* View Player Details
* Search Players
* Filter Players
* Player Profile Management
* Team Assignment
* Player Statistics

---

# Module Structure

```bash
src/modules/player/

├── player.model.js
├── player.repository.js
├── player.service.js
├── player.controller.js
├── player.routes.js
├── player.validator.js
└── player.interface.js
```

---

# Database Schema

## Player Collection

```javascript
{
  _id: ObjectId,

  firstName: String,

  lastName: String,

  fullName: String,

  profileImage: String,

  jerseyNumber: Number,

  age: Number,

  battingStyle: String,

  bowlingStyle: String,

  role: String,

  nationality: String,

  teamId: ObjectId,

  matchesPlayed: Number,

  runs: Number,

  wickets: Number,

  catches: Number,

  status: String,

  isDeleted: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Mongoose Model

```javascript
const playerSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  fullName: {
    type: String
  },

  profileImage: {
    type: String
  },

  jerseyNumber: {
    type: Number
  },

  age: {
    type: Number
  },

  battingStyle: {
    type: String,
    enum: [
      "RIGHT_HAND_BAT",
      "LEFT_HAND_BAT"
    ]
  },

  bowlingStyle: {
    type: String,
    enum: [
      "RIGHT_ARM_FAST",
      "LEFT_ARM_FAST",
      "RIGHT_ARM_SPIN",
      "LEFT_ARM_SPIN"
    ]
  },

  role: {
    type: String,
    enum: [
      "BATSMAN",
      "BOWLER",
      "ALL_ROUNDER",
      "WICKET_KEEPER"
    ]
  },

  nationality: {
    type: String
  },

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  matchesPlayed: {
    type: Number,
    default: 0
  },

  runs: {
    type: Number,
    default: 0
  },

  wickets: {
    type: Number,
    default: 0
  },

  catches: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      "ACTIVE",
      "INJURED",
      "RETIRED"
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

## Player Must Belong To A Team

```javascript
if(!teamExists){
   throw Error(
      "Team not found"
   );
}
```

---

## Jersey Number Must Be Unique Within Team

Allowed:

```text
Team A
7
18
45
```

Not Allowed:

```text
Team A
18
18
```

---

## Age Validation

```javascript
if(age < 10){
   throw Error(
      "Invalid player age"
   );
}
```

---

# Player Roles

| Role          | Description       |
| ------------- | ----------------- |
| BATSMAN       | Specialist Batter |
| BOWLER        | Specialist Bowler |
| ALL_ROUNDER   | Batting & Bowling |
| WICKET_KEEPER | Wicket Keeper     |

---

# API Endpoints

---

## Create Player

### Request

```http
POST /api/players
```

### Authorization

```text
SUPER_ADMIN
ADMIN
```

### Request Body

```json
{
  "firstName": "Virat",
  "lastName": "Kohli",
  "jerseyNumber": 18,
  "age": 37,
  "battingStyle": "RIGHT_HAND_BAT",
  "role": "BATSMAN",
  "nationality": "India",
  "teamId": "684b6a34c2fdb6f62f73d781"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Player created successfully"
}
```

---

## Get All Players

```http
GET /api/players
```

### Query Params

```http
?page=1
&limit=10
&teamId=123
&role=BATSMAN
```

---

## Get Player By ID

```http
GET /api/players/:id
```

---

## Update Player

```http
PATCH /api/players/:id
```

---

## Delete Player

```http
DELETE /api/players/:id
```

### Soft Delete

```javascript
{
  isDeleted: true
}
```

---

# Player Image Upload

## Endpoint

```http
POST /api/players/:id/image
```

### Supported Formats

```text
PNG
JPG
JPEG
WEBP
```

---

# Validation Rules

```javascript
{
  firstName: required,

  lastName: required,

  age: required,

  role: required,

  teamId: required
}
```

---

# Repository Layer

### Functions

```javascript
createPlayer()

findPlayerById()

findPlayers()

updatePlayer()

deletePlayer()

findPlayerByJersey()
```

---

# Service Layer

### Functions

```javascript
createPlayer()

getPlayers()

updatePlayer()

removePlayer()
```

### Responsibilities

* Business Validation
* Team Validation
* Jersey Validation
* Error Handling

---

# Controller Layer

### Functions

```javascript
createPlayerController()

getPlayersController()

getPlayerController()

updatePlayerController()

deletePlayerController()
```

---

# Search & Filters

## Search By Name

```http
GET /api/players?search=virat
```

---

## Filter By Team

```http
GET /api/players?teamId=123
```

---

## Filter By Role

```http
GET /api/players?role=BATSMAN
```

---

## Filter By Status

```http
GET /api/players?status=ACTIVE
```

---

# Player Statistics

Stored Statistics:

```javascript
{
  matchesPlayed: 50,

  runs: 3200,

  wickets: 25,

  catches: 18
}
```

---

# Common Errors

## Team Not Found

```json
{
  "success": false,
  "message": "Team not found"
}
```

---

## Duplicate Jersey Number

```json
{
  "success": false,
  "message": "Jersey number already exists"
}
```

---

## Player Not Found

```json
{
  "success": false,
  "message": "Player not found"
}
```

---

# Frontend Pages

## Player List

Features:

* Search
* Filters
* Pagination
* Statistics

---

## Create Player

Fields:

* First Name
* Last Name
* Jersey Number
* Age
* Team
* Role
* Batting Style
* Bowling Style
* Profile Image

---

## Edit Player

* Update Profile
* Change Team
* Update Statistics

---

## Player Details

Display:

* Personal Information
* Team Information
* Career Statistics
* Playing Role

---

# Testing Checklist

* [ ] Create Player
* [ ] Update Player
* [ ] Delete Player
* [ ] Upload Image
* [ ] Team Validation
* [ ] Jersey Validation
* [ ] Search Player
* [ ] Filter Player
* [ ] Pagination
* [ ] Authorization Check

---

# Git Commit Standards

```bash
feat(player): create player schema

feat(player): add create player API

feat(player): implement player listing

feat(player): add player image upload

feat(player): implement player statistics

fix(player): validate jersey number

fix(player): validate player age
```

---

# Definition of Done

✅ Player Schema Created

✅ CRUD APIs Completed

✅ Profile Image Upload Working

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

* Career Statistics Dashboard
* Performance Analytics
* Player Rankings
* Injury Tracking
* Awards & Achievements
* Player Transfer System
* AI Performance Prediction
* Player Comparison Feature
