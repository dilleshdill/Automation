import mongoose from "mongoose";

const playersSchema = new mongoose.Schema(
    {setNo : {type: String, required: true, unique: true},
    playersList : [
        {
            name: {type: String, required: true},
            battingStyle: {type: String, required: true},
            innings: {type: String, required: true},
            runs : {type: String, required: true},
            highest : {type: String, required: true},
            average : {type: String, required: true},
            strikeRate : {type: String, required: true},
            fifties : {type: String, required: true},
            hundreds : {type: String, required: true},
            imageUrl : {type: String, required: true},
        }
    ]
},{ timestamps: true });

export const Players =
  mongoose.models.Players ||
  mongoose.model("Players", playersSchema
)