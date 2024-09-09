import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//login process.
export const Login = async (req, res) => {
    try {
        //data accept for login.
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"Invalid data",
                success:false
            })
        };
        //finding email already existing.
        const user = await User.findOne({email});
        //user is not there in the data.
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password",
                success:false
            });
        }
        //comparing hash password with user password.
        const isMatch = await bcryptjs.compare(password, user.password);
        //if not match.
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid email or password",
                success:false
            });
        }
        // if user match, generate token.
        const tokenData = {
            id:user._id
        }
        const token = await jwt.sign(tokenData, "edcjeiuhdwjde9duehdedieid",{expiresIn:"1d"});
        return res.status(200).cookie("token", token, {httpOnly:true}).json({
            message:`Welcome back ${user.fullName}`,
            user,
            success:true
        })

    } catch (error) {
        
    }
};

//logout process.
export const Logout = async (req, res) => {
    return res.status(200).cookie("token", "", {expiresIn:new Date(Date.now()), httpOnly:true}).json({
        message:"User logged out successfully.",
        success:true
    });
}

export const Register = async (req, res) => {
    try {
        //user se value accept kiya.
        const {fullName, email, password} = req.body; 
        //koi value nhi put kiya toh error show kra ge.
        if(!fullName || !email || !password){   
            return res.status(401).json({
                message:"Invalide data",
                success:false
            })
        }
        //checking not already register with this email.
        const user = await User.findOne({email});
        //if already register.
        if(user){ 
            return res.status(401).json({
                message:"This email is already used",
                success:false,
            })
        }
        
        //hashing the password.
        const hashedPassword = await bcryptjs.hash(password, 16)

        //new user register.
        await User.create({
            fullName,
            email,
            password:hashedPassword
        });
        
        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
};