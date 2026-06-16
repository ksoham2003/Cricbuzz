# CricBuzz - Live Cricket Scoring Platform

Production-level cricket scoring platform with real-time updates, role-based access control, and comprehensive tournament management.

## 🎯 Project Overview

CricBuzz is a complete cricket management and live scoring platform designed for tournaments, series, and matches of all formats. It provides role-based access control for different user types and real-time updates via WebSocket.

### Key Features

- **Role-Based Access Control (RBAC)**
  - SUPER_ADMIN: Complete platform access
  - ADMIN: Tournament and match management
  - SCORER: Live match operations

- **Tournament Management**
  - Create and manage cricket series
  - Team and player management
  - Squad creation and management

- **Match Operations**
  - Match scheduling and creation
  - Toss management
  - Playing XI selection

- **Live Scoring**
  - Ball-by-ball scoring
  - Real-time commentary
  - Live match updates via WebSocket
  - Innings management

## 📁 Project Structure

### Backend (`/server`)

```
server/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # HTTP server initialization
│   ├── config/
│   │   ├── env.js            # Environment variables
│   │   └── logger.js          # Pino logging setup
│   ├── constant/              # Application constants
│   ├── database/              # MongoDB connection
│   ├── middleware/            # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── security.middleware.js
│   ├── model/                 # Mongoose models
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── series/
│   │   ├── team/
│   │   ├── player/
│   │   ├── squad/
│   │   ├── match/
│   │   ├── playing-xi/
│   │   ├── score/
│   │   └── commentary/
│   ├── repository/            # Data access layer
│   ├── socket/                # Socket.io integration
│   └── utils/                 # Utility functions
├── test/                      # Unit tests
├── docs/                      # API documentation
├── package.json
└── server.js
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── App.jsx               # Main routing
│   ├── pages/                # Page components
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── SeriesPage.jsx
│   │   ├── TeamsPage.jsx
│   │   ├── PlayersPage.jsx
│   │   ├── SquadsPage.jsx
│   │   ├── MatchesPage.jsx
│   │   ├── ScoringPage.jsx
│   │   └── UsersPage.jsx
│   ├── components/           # Reusable components
│   ├── context/              # Zustand stores
│   │   ├── authStore.js
│   │   └── appStore.js
│   ├── services/             # API and Socket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── layouts/              # Layout components
│   ├── config/               # Configuration
│   ├── styles/               # Global styles
│   └── utils/                # Utility functions
├── public/
├── index.html
├── .env.local                # Local development
├── .env.production           # Production config
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB 5.0+
- npm or yarn

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# MONGODB_URI=mongodb://localhost:27017/cricbuzz
# PORT=3000
# ACCESS_TOKEN_SECRET=your-secret-key
# REFRESH_TOKEN_SECRET=your-refresh-secret

# Start MongoDB
mongod

# Run development server
npm run dev

# Or run with npm start
npm start

# Seed database
npm run seed
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Configure environment variables
# VITE_API_URL=http://localhost:3000/api
# VITE_SOCKET_URL=http://localhost:3000

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 API Documentation

### Authentication
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **POST** `/api/auth/refresh` - Refresh access token
- **GET** `/api/auth/me` - Get current user

### User Management (SUPER_ADMIN)
- **GET** `/api/users` - List all users
- **POST** `/api/users` - Create new user
- **GET** `/api/users/:id` - Get user by ID
- **PATCH** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Series Management
- **GET** `/api/series` - List series
- **POST** `/api/series` - Create series
- **GET** `/api/series/:id` - Get series by ID
- **PATCH** `/api/series/:id` - Update series
- **DELETE** `/api/series/:id` - Delete series

### Teams Management
- **GET** `/api/teams` - List teams
- **POST** `/api/teams` - Create team
- **GET** `/api/teams/:id` - Get team by ID
- **PATCH** `/api/teams/:id` - Update team
- **DELETE** `/api/teams/:id` - Delete team

### Players Management
- **GET** `/api/players` - List players
- **POST** `/api/players` - Create player
- **GET** `/api/players/:id` - Get player by ID
- **PATCH** `/api/players/:id` - Update player
- **DELETE** `/api/players/:id` - Delete player

### Squads Management
- **GET** `/api/squads` - List squads
- **POST** `/api/squads` - Create squad
- **GET** `/api/squads/:id` - Get squad by ID
- **POST** `/api/squads/:id/players` - Add player to squad
- **DELETE** `/api/squads/:id/players/:playerId` - Remove player

### Matches Management
- **GET** `/api/matches` - List matches
- **POST** `/api/matches` - Create match
- **GET** `/api/matches/:id` - Get match by ID
- **POST** `/api/matches/:id/toss` - Conduct toss
- **POST** `/api/matches/:id/start` - Start match
- **POST** `/api/matches/:id/playing-xi` - Select playing XI
- **POST** `/api/matches/:id/complete` - Complete match

### Playing XI Management
- **GET** `/api/playing-xi/:matchId` - Get playing XI
- **POST** `/api/playing-xi/:matchId` - Select playing XI

### Scoring
- **GET** `/api/scores` - List scores
- **POST** `/api/scores` - Create score
- **GET** `/api/scores/:id` - Get score by ID
- **PATCH** `/api/scores/:id` - Update score
- **DELETE** `/api/scores/:id` - Delete score

### Commentary
- **GET** `/api/commentary` - List commentary
- **POST** `/api/commentary` - Add commentary
- **DELETE** `/api/commentary/:id` - Delete commentary

## 🔐 Authentication & Authorization

### Token Management
- Access Token: 15 minutes validity
- Refresh Token: 7 days validity
- Tokens stored in httpOnly cookies

### Role Hierarchy
```
SUPER_ADMIN
    ↓
  ADMIN
    ↓
  SCORER
```

### Role Permissions

**SUPER_ADMIN**
- All platform operations
- User management
- System settings
- Dashboard analytics

**ADMIN**
- Series management
- Team management
- Player management
- Squad management
- Match creation and scheduling
- Playing XI selection

**SCORER**
- Conduct toss
- Start/manage innings
- Record scores
- Add commentary
- Complete matches

## 🏗️ Technology Stack

### Backend
- **Framework**: Express.js 5.x
- **Database**: MongoDB 5.0+
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io 4.x
- **Validation**: Zod 4.x
- **Logging**: Pino
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 19.x
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Build Tool**: Vite
- **Styling**: CSS3

## 📦 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ["SUPER_ADMIN", "ADMIN", "SCORER"],
  status: Enum ["ACTIVE", "INACTIVE"],
  picture: String,
  refreshToken: String,
  isDeleted: Boolean,
  timestamps
}
```

### Series Model
```javascript
{
  name: String (unique),
  shortName: String (unique),
  format: Enum ["T10", "T20", "ODI", "TEST"],
  startDate: Date,
  endDate: Date,
  status: Enum ["UPCOMING", "ONGOING", "COMPLETED"],
  totalTeams: Number,
  createdBy: ObjectId,
  isDeleted: Boolean,
  timestamps
}
```

### Match Model
```javascript
{
  seriesId: ObjectId,
  team1: ObjectId,
  team2: ObjectId,
  venue: String,
  scheduledDate: Date,
  status: Enum ["UPCOMING", "TOSS_COMPLETED", "LIVE", "COMPLETED"],
  toss: {
    winner: ObjectId,
    decision: Enum ["BAT", "BOWL"]
  },
  playingXI: {
    team1: Array,
    team2: Array
  },
  result: Object,
  isDeleted: Boolean,
  timestamps
}
```

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Run with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Docker Support
```bash
# Build Docker image
docker build -t cricbuzz:latest .

# Run container
docker run -p 3000:3000 cricbuzz:latest
```

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cricbuzz
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env.production)**
```
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

## 📖 Documentation

Detailed module documentation available in `/server/docs`:
- `AUTH_MODULE.md` - Authentication & authorization
- `USER_MODULE.md` - User management
- `SERIES_MODULE.md` - Tournament management
- `TEAM_MODULE.md` - Team operations
- `PLAYER_MODULE.md` - Player management
- `SQUAD_MODULE.md` - Squad management
- `MATCH_MODULE.md` - Match operations
- `SCORE_MODULE.md` - Scoring system
- `COMMENTARY_MODULE.md` - Live commentary

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💼 Module Owners

- **Auth & Security**: Soham Kadam
- **User Management**: Soham Kadam
- **Series Management**: Soham Kadam
- **Team Management**: Soham Kadam
- **Match Operations**: Soham Kadam

## 🆘 Support

For issues and questions, please create an issue in the repository or contact the development team.

## 🎉 Acknowledgments

Built with production-level code practices, comprehensive error handling, and role-based access control for a complete cricket management solution.
