# 🏏 Squad Management Module

## Module Owner

**Match Operations Team**

---

# Overview

The Squad Management Module is responsible for managing the list of players registered for a team in a specific series.

A Squad represents all players available for selection before choosing the final Playing XI for a match.

Relationship:

```text
Series
  └── Team
        └── Squad (15-25 Players)
                └── Playing XI (11 Players)
```

Examples:

* Mumbai Indians Squad - IPL 2026
* CSK Squad - IPL 2026
* India Squad - World Cup 2027

---

# Responsibilities

### Core Features

* Create Squad
* Add Players To Squad
* Remove Players From Squad
* View Squad
* Update Squad
* Squad Validation
* Squad Statistics

---

# Access Control

## Allowed Roles

```text
SUPER_ADMIN
ADMIN
```

Scorers cannot modify squad information.

---

# Module Structure

```bash
src/modules/squad/

├── squad.model.js
├── squad.repository.js
├── squad.service.js
├── squad.controller.js
├── squad.routes.js
├── squad.validator.js
└── squad.interface.js
```

---

# Database Schema

## Squad Collection

```javascript
{
  _id: ObjectId,

  seriesId: ObjectId,

  teamId: ObjectId,

  players: [ObjectId],

  totalPlayers: Number,

  status: String,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Mongoose Model

```javascript
const squadSchema = new mongoose.Schema(
{
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Series",
    required: true
  },

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  }],

  totalPlayers: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      "ACTIVE",
      "LOCKED"
    ],
    default: "ACTIVE"
  }
},
{
  timestamps: true
});
```

---

# Business Rules

## One Squad Per Team Per Series

```javascript
{
  seriesId,
  teamId
}
```

Must be unique.

Example:

```text
IPL 2026
  └── Mumbai Indians Squad
```

Only one squad allowed.

---

## Squad Size Rules

Minimum:

```text
11 Players
```

Maximum:

```text
25 Players
```

Validation:

```javascript
if(players.length > 25){
   throw Error(
      "Maximum squad size exceeded"
   );
}
```

---

## Player Must Belong To Team

```javascript
if(player.teamId !== teamId){
   throw Error(
      "Player does not belong to team"
   );
}
```

---

## Prevent Duplicate Players

```javascript
if(playerAlreadyExists){
   throw Error(
      "Player already added"
   );
}
```

---

## Locked Squad

Once tournament starts:

```javascript
status = "LOCKED"
```

No further changes allowed.

---

# API Endpoints

---

## Create Squad

### Request

```http
POST /api/squads
```

### Authorization

```text
SUPER_ADMIN
ADMIN
```

### Request Body

```json
{
  "seriesId": "123",

  "teamId": "456"
}
```

---

## Add Player To Squad

### Request

```http
POST /api/squads/:id/players
```

### Body

```json
{
  "playerId": "789"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Player added successfully"
}
```

---

## Remove Player From Squad

### Request

```http
DELETE /api/squads/:id/players/:playerId
```

---

## Get Squad

### Request

```http
GET /api/squads/:id
```

### Response

```json
{
  "_id": "123",

  "teamId": "456",

  "seriesId": "789",

  "players": []
}
```

---

## Get Team Squad

### Request

```http
GET /api/squads/team/:teamId
```

---

## Update Squad Status

### Request

```http
PATCH /api/squads/:id/status
```

### Body

```json
{
  "status": "LOCKED"
}
```

---

# Validation Rules

## Create Squad

```javascript
{
  seriesId: required,

  teamId: required
}
```

---

## Add Player

```javascript
{
  playerId: required
}
```

---

# Repository Layer

### Functions

```javascript
createSquad()

findSquadById()

findSquadByTeam()

addPlayer()

removePlayer()

updateSquad()

deleteSquad()
```

---

# Service Layer

### Functions

```javascript
createSquad()

getSquad()

addPlayerToSquad()

removePlayerFromSquad()

lockSquad()
```

### Responsibilities

* Team Validation
* Series Validation
* Squad Size Validation
* Duplicate Checks
* Business Rules

---

# Controller Layer

### Functions

```javascript
createSquadController()

getSquadController()

addPlayerController()

removePlayerController()

updateSquadStatusController()
```

---

# Search & Filters

## Squad By Team

```http
GET /api/squads/team/:teamId
```

---

## Squad By Series

```http
GET /api/squads?seriesId=123
```

---

# Error Handling

## Squad Already Exists

```json
{
  "success": false,
  "message": "Squad already exists"
}
```

---

## Player Already Added

```json
{
  "success": false,
  "message": "Player already added to squad"
}
```

---

## Squad Locked

```json
{
  "success": false,
  "message": "Squad is locked"
}
```

---

## Invalid Squad Size

```json
{
  "success": false,
  "message": "Maximum squad size exceeded"
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

## Squad List

Features:

* Team Name
* Series Name
* Total Players
* Status

---

## Squad Details

Display:

* Team Information
* Player List
* Squad Size
* Status

---

## Add Players

Features:

* Player Selection Dropdown
* Search Player
* Team Validation

---

# Testing Checklist

* [ ] Create Squad
* [ ] Add Player
* [ ] Remove Player
* [ ] Get Squad
* [ ] Lock Squad
* [ ] Duplicate Player Validation
* [ ] Team Validation
* [ ] Squad Size Validation
* [ ] Authorization Check

---

# Git Commit Standards

```bash
feat(squad): create squad schema

feat(squad): add create squad API

feat(squad): implement add player feature

feat(squad): implement remove player feature

feat(squad): add squad locking

fix(squad): validate duplicate players

fix(squad): validate squad size
```

---

# Definition of Done

✅ Squad Schema Created

✅ Squad CRUD APIs Completed

✅ Add/Remove Player Functionality

✅ Squad Size Validation

✅ Team Validation

✅ Lock Squad Feature

✅ Authorization Added

✅ Postman Tested

✅ Frontend Integrated

✅ Code Reviewed

✅ Merged To Main Branch

---

# Future Enhancements

* Squad Import From Excel
* Bulk Player Selection
* Auto Squad Suggestions
* Injury Replacement Workflow
* Squad Analytics
* Squad Comparison
* Auction Integration
* AI Squad Builder
