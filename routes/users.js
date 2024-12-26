var express=require("express");
var router=express.Router();
router.get('/',function(req,res,next){
  res.send('respond with a resource');
});
module.exports=router;




const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/IPL_PREDICTIONS");
const Schema=mongoose.Schema({
  "innings":Number,
  "batting_team":String,
  "bowling_team":String,
  "over":Number,
  "ball":Number,
  "batter":String,
  "non_striker":String,
  "bowler":String,
  "score":Number,
  "crr":Number,
  "toss_winner":String,
  "toss_decision":String,
  "venue":String,
  "prediction":String
});
pred=mongoose.model("predictions",Schema);
module.exports=pred;