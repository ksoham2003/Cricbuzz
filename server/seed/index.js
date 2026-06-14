import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models
import User from "../src/model/user.model.js";
import Series from "../src/modules/series/series.model.js";
import Team from "../src/modules/team/team.model.js";
import Player from "../src/modules/player/player.model.js";
import Match from "../src/modules/match/match.model.js";
import Score from "../src/modules/score/score.model.js";
import Commentary from "../src/modules/commentary/commentary.model.js";

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/cricbuzz";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected successfully.");

    // 1. Destructively clear database
    console.log("Clearing all collections...");
    await Promise.all([
      User.deleteMany({}),
      Series.deleteMany({}),
      Team.deleteMany({}),
      Player.deleteMany({}),
      Match.deleteMany({}),
      Score.deleteMany({}),
      Commentary.deleteMany({}),
    ]);
    console.log("Database cleared successfully.");

    // 2. Create users
    console.log("Creating seed users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@cricbuzz.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    });

    const scorer = await User.create({
      name: "Live Scorer",
      email: "scorer@cricbuzz.com",
      password: hashedPassword,
      role: "SCORER",
      status: "ACTIVE",
    });

    console.log("Users created:", {
      superAdmin: superAdmin.email,
      scorer: scorer.email,
    });

    // 3. Create Series
    console.log("Creating Border-Gavaskar Trophy Series...");
    const series = await Series.create({
      name: "Border-Gavaskar Trophy 2026",
      shortName: "BGT-2026",
      description: "India tour of Australia 2026/27 five match test series.",
      format: "TEST",
      startDate: new Date("2026-11-20"),
      endDate: new Date("2027-01-15"),
      totalTeams: 2,
      status: "ONGOING",
      createdBy: superAdmin._id,
    });

    // 4. Create Teams (without captain initially)
    console.log("Creating Teams...");
    const indiaTeam = await Team.create({
      name: "India",
      shortName: "IND",
      logo: "https://px.pixxo.io/test/ind.png",
      primaryColor: "#005A9C",
      secondaryColor: "#FF9933",
      city: "Mumbai",
      coach: "Gautam Gambhir",
      seriesId: series._id,
      totalMatches: 1,
      createdBy: superAdmin._id,
    });

    const australiaTeam = await Team.create({
      name: "Australia",
      shortName: "AUS",
      logo: "https://px.pixxo.io/test/aus.png",
      primaryColor: "#FFCD00",
      secondaryColor: "#00843D",
      city: "Melbourne",
      coach: "Andrew McDonald",
      seriesId: series._id,
      totalMatches: 1,
      createdBy: superAdmin._id,
    });

    // 5. Create 11 Indian Players & 11 Australian Players
    console.log("Creating Indian Players...");
    const indianPlayersData = [
      { firstName: "Rohit", lastName: "Sharma", age: 39, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: indiaTeam._id },
      { firstName: "Yashasvi", lastName: "Jaiswal", age: 24, role: "BATSMAN", battingStyle: "LEFT_HAND_BAT", teamId: indiaTeam._id },
      { firstName: "Shubman", lastName: "Gill", age: 26, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", teamId: indiaTeam._id },
      { firstName: "Virat", lastName: "Kohli", age: 37, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", teamId: indiaTeam._id },
      { firstName: "Rishabh", lastName: "Pant", age: 28, role: "WICKET_KEEPER", battingStyle: "LEFT_HAND_BAT", teamId: indiaTeam._id },
      { firstName: "KL", lastName: "Rahul", age: 34, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", teamId: indiaTeam._id },
      { firstName: "Ravindra", lastName: "Jadeja", age: 37, role: "ALL_ROUNDER", battingStyle: "LEFT_HAND_BAT", bowlingStyle: "LEFT_ARM_SPIN", teamId: indiaTeam._id },
      { firstName: "Ravichandran", lastName: "Ashwin", age: 39, role: "ALL_ROUNDER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: indiaTeam._id },
      { firstName: "Jasprit", lastName: "Bumrah", age: 32, role: "BOWLER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: indiaTeam._id },
      { firstName: "Mohammed", lastName: "Siraj", age: 32, role: "BOWLER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: indiaTeam._id },
      { firstName: "Akash", lastName: "Deep", age: 29, role: "BOWLER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: indiaTeam._id },
    ];

    const indianPlayers = await Promise.all(
      indianPlayersData.map(p => Player.create({ ...p, createdBy: superAdmin._id }))
    );

    console.log("Creating Australian Players...");
    const australianPlayersData = [
      { firstName: "Usman", lastName: "Khawaja", age: 39, role: "BATSMAN", battingStyle: "LEFT_HAND_BAT", teamId: australiaTeam._id },
      { firstName: "Nathan", lastName: "McSweeney", age: 26, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: australiaTeam._id },
      { firstName: "Marnus", lastName: "Labuschagne", age: 31, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: australiaTeam._id },
      { firstName: "Steven", lastName: "Smith", age: 37, role: "BATSMAN", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: australiaTeam._id },
      { firstName: "Travis", lastName: "Head", age: 32, role: "BATSMAN", battingStyle: "LEFT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: australiaTeam._id },
      { firstName: "Mitchell", lastName: "Marsh", age: 34, role: "ALL_ROUNDER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: australiaTeam._id },
      { firstName: "Alex", lastName: "Carey", age: 34, role: "WICKET_KEEPER", battingStyle: "LEFT_HAND_BAT", teamId: australiaTeam._id },
      { firstName: "Pat", lastName: "Cummins", age: 33, role: "BOWLER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: australiaTeam._id },
      { firstName: "Mitchell", lastName: "Starc", age: 36, role: "BOWLER", battingStyle: "LEFT_HAND_BAT", bowlingStyle: "LEFT_ARM_FAST", teamId: australiaTeam._id },
      { firstName: "Nathan", lastName: "Lyon", age: 38, role: "BOWLER", battingStyle: "RIGHT_HAND_BAT", bowlingStyle: "RIGHT_ARM_SPIN", teamId: australiaTeam._id },
      { firstName: "Josh", lastName: "Hazlewood", age: 35, role: "BOWLER", battingStyle: "LEFT_HAND_BAT", bowlingStyle: "RIGHT_ARM_FAST", teamId: australiaTeam._id },
    ];

    const australianPlayers = await Promise.all(
      australianPlayersData.map(p => Player.create({ ...p, createdBy: superAdmin._id }))
    );

    // 6. Update Captains in Teams
    console.log("Assigning Captains to Teams...");
    const indCaptain = indianPlayers.find(p => p.firstName === "Rohit");
    const ausCaptain = australianPlayers.find(p => p.firstName === "Pat");

    indiaTeam.captain = indCaptain._id;
    await indiaTeam.save();

    australiaTeam.captain = ausCaptain._id;
    await australiaTeam.save();

    // 7. Create Match (LIVE with full playingXI)
    console.log("Scheduling Live Match...");
    const match = await Match.create({
      seriesId: series._id,
      matchNumber: "1st Test",
      venue: "Melbourne Cricket Ground (MCG)",
      startTime: new Date("2026-11-20T10:30:00Z"),
      status: "LIVE",
      team1: indiaTeam._id,
      team2: australiaTeam._id,
      tossWinner: indiaTeam._id,
      tossDecision: "BAT",
      playingXI: {
        team1: indianPlayers.map(p => ({
          player: p._id,
          isCaptain: p.firstName === "Rohit",
          isWicketKeeper: p.firstName === "Rishabh"
        })),
        team2: australianPlayers.map(p => ({
          player: p._id,
          isCaptain: p.firstName === "Pat",
          isWicketKeeper: p.firstName === "Alex"
        }))
      },
      createdBy: superAdmin._id,
    });

    console.log("Match created:", match._id);

    // 8. Create Score record
    console.log("Creating live score scorecard...");
    const score = await Score.create({
      matchId: match._id,
      innings: 1,
      battingTeam: indiaTeam._id,
      score: 326,
      wickets: 5,
      overs: "88.2",
      runRate: 3.69,
      createdBy: superAdmin._id,
    });

    console.log("Score card created:", score._id);

    // 9. Create Commentary records
    console.log("Creating ball commentary entries...");
    await Commentary.create({
      matchId: match._id,
      over: 88,
      ball: 1,
      text: "Siraj to Cummins, no run, defended solidly from the crease back to the bowler.",
      type: "NORMAL",
    });

    await Commentary.create({
      matchId: match._id,
      over: 88,
      ball: 2,
      text: "Siraj to Cummins, OUT! Clean bowled! Siraj fires a full delivery, Cummins plays across the line and middle stump is knocked out of the ground! Stunner!",
      type: "WICKET",
    });

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed with error:", err);
  } finally {
    console.log("Closing connection...");
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

seed();
