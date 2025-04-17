// Middleware to check if the user is authenticated
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRETKEY;

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        // Split the string and get the token
        const token = bearerHeader.split(" ")[1];
        req.token = token;
        
        jwt.verify(token, secretKey, (err, data) => {
            if (err) {
                res.status(403).send({ message: "Invalid token", err });
            } else {
                req.user = data;
                next();
            }
        });
    } else {
        res.status(403).send({ message: "Token missing or invalid" });
    }
}

export { verifyToken };
