# 🏏 Match Management Module

## Module Owner

Rohit Pokhariya

---

# Overview

The Match Module manages the complete lifecycle of a cricket match.

This includes:

* Match Scheduling
* Team Selection
* Venue Assignment
* Toss Management
* Match Start
* Live Match Tracking
* Match Completion
* Result Declaration

Access:

```text
SUPER_ADMIN
ADMIN
SCORER
```

---

# Responsibilities

### Admin

* Create Match
* Update Match
* Delete Match
* Assign Teams
* Assign Venue

### Scorer

* Start Match
* Conduct Toss
* Manage Live Score
* End Match

---

# Match Lifecycle

```text
SCHEDULED
     ↓
TOSS_COMPLETED
     ↓
LIVE
     ↓
INNINGS_BREAK
     ↓
LIVE
     ↓
COMPLETED
```

---

# Module Structure

```bash
src/modules/match/

├── match.model.js
├── match.repository.js
├── match.service.js
├── match.controller.js
├── match.routes.js
├── match.validator.js
└── match.interface.js
```

---

# Database Schema

```javascript
{
  _id: ObjectId,

  seriesId: ObjectId,

  teamA: ObjectId,

  teamB: ObjectId,

  venue: String,

  matchDate: Date,

  format: String,

  overs: Number,

  tossWinner: ObjectId,

  tossDecision: String,

  winner: ObjectId,

  status: String,

  result: String,

  createdBy: ObjectId,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Match Status

| Status         | Description     |
| -------------- | --------------- |
| SCHEDULED      | Match Created   |
| TOSS_COMPLETED | Toss Finished   |
| LIVE           | Match Running   |
| INNINGS_BREAK  | Innings Break   |
| COMPLETED      | Match Finished  |
| ABANDONED      | Match Cancelled |

---

# API Endpoints

## Create Match

POST /api/matches

### Authorization

```text
SUPER_ADMIN
ADMIN
```

### Request

```json
{
  "seriesId":"123",
  "teamA":"111",
  "teamB":"222",
  "venue":"Wankhede Stadium",
  "matchDate":"2026-06-20",
  "format":"T20",
  "overs":20
}
```

---

## Get All Matches

GET /api/matches

Query Params

```http
?page=1
&limit=10
&status=LIVE
```

---

## Get Match By ID

GET /api/matches/:id

---

## Update Match

PATCH /api/matches/:id

---

## Delete Match

DELETE /api/matches/:id

Soft Delete Only

---

## Conduct Toss

POST /api/matches/:id/toss

### Authorization

```text
SCORER
ADMIN
```

### Request

```json
{
  "tossWinner":"111",
  "decision":"BAT"
}
```

---

## Start Match

POST /api/matches/:id/start

Changes:

```javascript
status = "LIVE"
```

---

## End Match

POST /api/matches/:id/end

### Request

```json
{
  "winner":"111",
  "result":"Mumbai Indians won by 6 wickets"
}
```

Changes:

```javascript
status = "COMPLETED"
```

---

# Business Rules

### Teams Cannot Be Same

```javascript
if(teamA === teamB){
 throw Error("Teams must be different");
}
```

---

### Toss Before Match Start

```javascript
if(status !== "TOSS_COMPLETED"){
 throw Error("Complete toss first");
}
```

---

### Match Must Have Playing XI

```javascript
if(teamAXI.length !== 11){
 throw Error("Team A XI incomplete");
}

if(teamBXI.length !== 11){
 throw Error("Team B XI incomplete");
}
```

---

### Winner Validation

Winner must be:

```text
Team A
or
Team B
```

---

# Repository Functions

```javascript
createMatch()

findMatchById()

findMatches()

updateMatch()

deleteMatch()
```

---

# Service Functions

```javascript
createMatch()

conductToss()

startMatch()

endMatch()

updateMatch()
```

---

# Common Errors

## Match Not Found

```json
{
  "success": false,
  "message": "Match not found"
}
```

---

## Invalid Toss

```json
{
  "success": false,
  "message": "Invalid toss winner"
}
```

---

## Match Already Live

```json
{
  "success": false,
  "message": "Match already started"
}
```

---

# Testing Checklist

* Create Match
* Update Match
* Delete Match
* Conduct Toss
* Start Match
* Complete Match
* Validate Playing XI
* Validate Winner
* Authorization

---

# Definition Of Done

✅ Match CRUD Complete

✅ Toss Management Complete

✅ Match Lifecycle Complete

✅ Validation Complete

✅ Authorization Added

✅ Postman Tested

✅ Frontend Integrated

✅ Merged To Main
