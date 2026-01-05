import { Players } from "../models/playersModel.js";

export const addPlayer = async (req, res) => {
  try {
    
    const {
      setNo,
      name,
      innings,
      battingStyle,
      average,
      strikeRate,
      runs,
      highest,
      fifties,
      hundreds,
      imageUrl,
    } = req.body;

    if (
      setNo == null ||
      !name ||
      innings == null ||
      !battingStyle ||
      average == null ||
      strikeRate == null ||
      runs == null ||
      highest == null ||
      fifties == null ||
      hundreds == null ||
      !imageUrl
    ) {
      return res.status(400).json({
        message: "Provide all the required details",
      });
    }

    let seat = await Players.findOne({ setNo });

    if (!seat) {
      seat = new Players({
        setNo,
        playersList: [
          {
            name,
            innings,
            battingStyle,
            average,
            strikeRate,
            runs,
            highest,
            fifties,
            hundreds,
            imageUrl,
          },
        ],
      });

      await seat.save();

      return res.status(201).json({
        message: "Player added",
        data: seat,
      });
    }

    // Prevent duplicate player
    const playerExists = seat.playersList.some(
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );

    if (playerExists) {
      return res.status(409).json({
        message: "Player already exists in this set",
      });
    }

    //  Add player
    seat.playersList.push({
      name,
      innings,
      battingStyle,
      average,
      strikeRate,
      runs,
      highest,
      fifties,
      hundreds,
      imageUrl,
    });

    await seat.save();

    return res.status(201).json({
      message: "Player added",
      data: seat,
    });

  } catch (error) {
    console.error("Add player error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message, // useful in dev
    });
  }
};
