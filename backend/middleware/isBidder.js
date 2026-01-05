export const isBidder = (req,res,next) =>{
    if(req.user.role != 'Bidder'){
        return res.status(403).json({message:"Bidder access only"});
    }
    next();
} 