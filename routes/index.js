var express = require('express');
var router = express.Router();
const axios = require('axios');
const pred = require('./users');
const run_pred = require('./user1');
const cors = require('cors');
let predictionResult = null;
router.use(cors());


// POST request to / route (for prediction)
router.post("/", async (req, res) => {
  const userInput = req.body;
  console.log(userInput)
  const data = [
    req.body.innings,
    req.body.battingTeam,
    req.body.bowlingTeam,
    req.body.overs,
    req.body.balls,
    req.body.striker,
    req.body.nonStriker,
    req.body.bowler,
    req.body.score,
    req.body.crr,
    req.body.tossWinner,
    req.body.tossDecision,
    req.body.venue
  ];

  try {
    // Make a POST request to the Flask /predict route
    const response = await axios.post("http://localhost:5000/predict", data);

    // Log the response for debugging
    console.log("Response from Flask /predict:", response.data);

    // Send the prediction back to the client
    predictionResult = response.data.prediction[0];
    res.json({ prediction: predictionResult});
  } catch (error) {
    console.error("Error sending request to Flask:", error.message);
    res.status(500).json({ error: "Failed to get a response from the model" });
  }

  // Save the prediction to MongoDB
  pred.create({
    innings: userInput.innings,
    batting_team: userInput.battingTeam,
    score: userInput.score,
    batter: userInput.striker,
    non_striker: userInput.nonStriker,
    over: userInput.overs,
    ball: userInput.balls,
    bowling_team: userInput.bowlingTeam,
    bowler: userInput.bowler,
    venue: userInput.venue,
    crr: userInput.crr,
    toss_winner: userInput.tossWinner,
    toss_decision: userInput.tossDecision,
    wickets: userInput.wicketsLeft,
    prediction: predictionResult
  });
});
router.get("/run",(req,res)=>{
res.render('index1');

})

// POST request to /run route (for run prediction)
router.post("/run", async (req, res) => {
  const userInput = req.body;
  console.log("hi")
  const data = [
    req.body.inning,
    req.body.batting_team,
    req.body.bowling_team,
    req.body.over,
    req.body.ball,
    req.body.batsman,
    req.body.non_striker,
    req.body.bowler,
    req.body.run_per_ball,
    req.body.score,
    req.body.crr
  ];

  try {
    // Log the data being sent to Flask for debugging
    console.log("Sending data to Flask /run route:", data);

    // Make a POST request to the Flask /run route
    const response = await axios.post("http://localhost:5000/run", data);

    // Log the response from Flask for debugging
    console.log("Response from Flask /run:", response.data);

    // Send the prediction back to the client
    predictionResult = response.data.prediction[0];
    run_pred.create({
      innings: userInput.innings,
      batting_team: userInput.batting_team,
      score: userInput.score,
      batter: userInput.batter,
      non_striker: userInput.non_striker,
      over: userInput.over,
      ball: userInput.ball,
      bowling_team: userInput.bowling_team,
      bowler: userInput.bowler,
      crr: userInput.crr,
      wickets: userInput.wickets,
      prediction: predictionResult[0]
    });
    res.json({ prediction: predictionResult[0] });
  } catch (error) {
    console.error("Error sending request to Flask:", error.message);
    res.status(500).json({ error: "Failed to get a response from the model" });
  }

  // Save the prediction to MongoDB
  
});

module.exports = router;
