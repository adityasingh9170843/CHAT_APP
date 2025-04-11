// Generate JWT token and set it in cookie
import jwt from 'jsonwebtoken';


const generateToken = (userId,res) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('jwt', token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true, //prevent XSS attack
        sameSite : 'strict',
        secure: process.env.NODE_ENV === 'development' ? true : false
    });

    return token;
}
    
export default generateToken;