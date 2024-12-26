var express=require("express");
var router=express.Router();
router.get('/',function(req,res,next){
  res.send('respond with a resource');
});
module.exports=router;
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/IPL_PREDICTIONS");
const Schema1=mongoose.Schema({
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
    "wickets":Number,
    "prediction":Number
  });
  run_pred=mongoose.model("run_prediction",Schema1);
  module.exports=run_pred;