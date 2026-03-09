import jwt from "jsonwebtoken"
import config from "../config.js";

// Yaha 3 parameters hote hain
function userMiddleware(req, res, next){

    //Frontend se token aata hai header me.
    const authHeader = req.headers.authorization;

   //Agar: header nahi hai // Bearer token nahi hai
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({errors: 'No token provided'});
    }
    const token = authHeader.split(" ")[1];

    try {   //Tum yaha use kar rahe ho:
        //  token valid hai secret key match ho rahi hai token expire nahi hua !!

        const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
        console.log("Decoded: "+ decoded)

        //Ab controller me userId access kar sakte ho.
        req.userId = decoded.id;
        // Ye next middleware ya route controller ko call karta hai.
      // Agar next() nahi likhoge to request yahi pe stuck ho jayegi.
        next();
    } catch(error){
        return res.status(401).json({errors:"Invalid token or expired"});
        console.log("error in user middleware" + error)
    }
}

export default userMiddleware;