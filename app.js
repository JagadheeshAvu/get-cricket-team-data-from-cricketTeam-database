const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

// GET Players API
app.get("/players/", async (request, response) => {
  const playersDetails = `
    SELECT *
    FROM cricket_team
    ORDER BY player_Id;`;
  const playersList = await db.all(playersDetails);
  response.send(playersList);
});

// POST players Details API
app.post("/players/", async (request, response) => {
  const createPlayer = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetails = `
    INSERT INTO cricket_team(playerName,jerseyNumber,role)
    VALUES (
        ${playerName},
        ${jerseyNumber},
        ${role};`;
  const dbResponse = await db.run(addPlayerDetails);
  const bookId = dbResponse.lastID;
  response.send("player Added to team");
});

// GET playerId API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerDetails);
  response.send(player);
});

// PUT update player API

app.put("/players/:playerId/", async (request,response) => {
    const { playerId } = request.params;
    const playerDetails = request.body;
    const {
        playerName,
        jerseyNumber,
        role,
    } = playerDetails;
    const updatePlayerDetails = `
      UPDATE
        cricket_team
      SET
        playerName = '${playerName}',
        jerseyNumber = '${jerseyNumber}`,
        role = ${role},
      WHERE player_id = ${playerId};`;
    await db.run(updatePlayerDetails);
    response.send("Player Details Updated");
});

// DELETE player API

app.delete("/players/:playerId/", (request,response) => {
    const {playerId} = request.params;
    const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});