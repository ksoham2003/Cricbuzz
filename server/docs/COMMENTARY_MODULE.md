# 💬 Commentary Module

## Module Owner

**Rohit**

---

# Overview

The Commentary Module is responsible for managing ball-by-ball match commentary and delivering real-time updates to cricket fans.

This module allows scorers and administrators to add live commentary during a match while users can view commentary updates instantly through Socket.IO.

The module works closely with:

* Match Module
* Score Module
* Socket.IO Module

---

# Responsibilities

### Core Features

* Add Ball-by-Ball Commentary
* View Match Commentary
* Delete Commentary Entry
* Real-Time Commentary Updates
* Commentary Pagination
* Event Broadcasting

---

# Module Structure

```bash
src/modules/commentary/

├── commentary.model.js
├── commentary.repository.js
├── commentary.service.js
├── commentary.controller.js
├── commentary.routes.js
├── commentary.validator.js
└── commentary.interface.js
```

---

# Database Schema

## Commentary Collection

```javascript
{
  _id: ObjectId,

  matchId: ObjectId,

  over: Number,

  ball: Number,

  text: String,

  type: String,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Model Definition

```javascript
{
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true
  },

  over: {
    type: Number,
    required: true
  },

  ball: {
    type: Number,
    required: true
  },

  text: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: [
      "NORMAL",
      "FOUR",
      "SIX",
      "WICKET",
      "MILESTONE"
    ],
    default: "NORMAL"
  }
}
```

---

# Commentary Types

| Type      | Description              |
| --------- | ------------------------ |
| NORMAL    | Standard Ball Commentary |
| FOUR      | Boundary                 |
| SIX       | Six Runs                 |
| WICKET    | Wicket Event             |
| MILESTONE | Fifty, Hundred, Record   |

---

# API Endpoints

---

## Add Commentary

### Request

```http
POST /api/commentary
```

### Authorization

```text
SUPER_ADMIN
SCORER
```

### Request Body

```json
{
  "matchId": "684b6a34c2fdb6f62f73d781",
  "over": 10,
  "ball": 3,
  "text": "FOUR! Beautiful cover drive through the gap.",
  "type": "FOUR"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Commentary added successfully",
  "data": {}
}
```

---

## Get Commentary By Match

### Request

```http
GET /api/commentary/match/:matchId
```

### Response

```json
[
  {
    "_id": "123",
    "over": 10,
    "ball": 3,
    "text": "FOUR! Beautiful cover drive.",
    "type": "FOUR"
  },
  {
    "_id": "124",
    "over": 10,
    "ball": 4,
    "text": "Single taken.",
    "type": "NORMAL"
  }
]
```

---

## Delete Commentary

### Request

```http
DELETE /api/commentary/:id
```

### Authorization

```text
SUPER_ADMIN
SCORER
```

### Response

```json
{
  "success": true,
  "message": "Commentary deleted successfully"
}
```

---

# Validation Rules

## Create Commentary

```javascript
{
  matchId: required,

  over: required,

  ball: required,

  text: required,

  type:
    NORMAL
    FOUR
    SIX
    WICKET
    MILESTONE
}
```

---

# Business Rules

### Match Must Be Live

Before creating commentary:

```javascript
if(match.status !== "LIVE"){
   throw Error(
      "Match is not live"
   );
}
```

---

### Ball Number Validation

Allowed:

```javascript
1
2
3
4
5
6
```

Not Allowed:

```javascript
0
7
8
```

---

### Commentary Order

Commentary should always appear:

```text
Latest Ball First
```

Sort Query:

```javascript
.sort({
  createdAt: -1
});
```

---

# Socket.IO Integration

## Event Name

```javascript
commentary.created
```

---

## Emit Event

```javascript
io.to(
  `match:${matchId}`
).emit(
  "commentary.created",
  commentary
);
```

---

## Payload Example

```json
{
  "_id": "123",

  "matchId": "684b6a34c2fdb6f62f73d781",

  "over": 10,

  "ball": 3,

  "text": "FOUR! Beautiful cover drive.",

  "type": "FOUR"
}
```

---

# Repository Layer

### Functions

```javascript
createCommentary()

getCommentaryByMatch()

deleteCommentary()

findCommentaryById()
```

---

# Service Layer

### Functions

```javascript
addCommentary()

fetchCommentary()

removeCommentary()
```

Responsibilities:

* Validate Match Status
* Validate Commentary Data
* Trigger Socket Events
* Handle Business Rules

---

# Controller Layer

### Functions

```javascript
createCommentaryController()

getCommentaryController()

deleteCommentaryController()
```

Responsibilities:

* Receive Request
* Call Service Layer
* Return Response

---

# Common Errors

## Match Not Live

```json
{
  "success": false,
  "message": "Match is not live"
}
```

---

## Commentary Not Found

```json
{
  "success": false,
  "message": "Commentary not found"
}
```

---

## Invalid Ball Number

```json
{
  "success": false,
  "message": "Invalid ball number"
}
```

---

# Testing Checklist

* [ ] Add Commentary
* [ ] Get Match Commentary
* [ ] Delete Commentary
* [ ] Socket Event Triggered
* [ ] Match Status Validation
* [ ] Commentary Order Validation
* [ ] Error Handling
* [ ] Postman Testing

---

# Git Commit Standards

```bash
feat(commentary): create commentary model

feat(commentary): add commentary API

feat(commentary): implement commentary listing

feat(socket): broadcast commentary events

fix(commentary): validate ball number

refactor(commentary): optimize commentary queries
```

---

# Definition of Done

* Commentary Model Created
* CRUD Operations Working
* Validation Implemented
* Socket.IO Integration Complete
* Real-Time Updates Working
* Postman Tested
* Code Reviewed
* Merged Into Main Branch

---

# Future Enhancements

* AI Generated Commentary
* Commentary Search
* Commentary Filters
* Multi-Language Commentary
* Commentary Highlights
* Auto Event Detection
