import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  // get data
  // validate
  // check if user already exists
  // create a user in database
  // create a verification token
  // save token in database
  // send token as email to user
  // send success status to user
  // save user

  console.log("req.body:", req.body); // Debug log to check incoming data

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not registered.",
      });
    }

    // function generateToken(length = 32) {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let token = '';
    //     for (let i = 0; i < length; i++) {
    //       token += characters.charAt(Math.floor(Math.random() * characters.length));
    //     }
    //     return token;
    // }

    // const token = generateToken();

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;

    await user.save();

    // send email

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  
    
    const mailOption = {
        from: process.env.MAILTRAP_SENDEREMAIL,  
        to: user.email,
        subject: "Verify you email", 
        text: `Please click on the following link :
        ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `
    }

    await transporter.sendMail(mailOption)

    res.status(201).json({
        message: "User Registered succeessfully",
        success: true
    })


  } catch (error) {
    res.status(400).json({
        message: "User not registered",
        error: error.message,
        success: false
    })
  }
};


const verifyUser = async (req, res) => {

  // get token from url
  // validate
  // find user based on token
  // if not then 
  // set isVerified field to true
  // remove verification token
  // save
  // return response

  const { token } = req.params 
  if(!token){
    return res.status(400).json({
      message: "Invalid token"
    })
  }

  const user = await User.findOne({verificationToken: token})

  if(!user){
    return res.status(400).json({
      message: "Invalid token. User not found"
    })
  }

  user.isVerified = true

  user.verificationToken = undefined

  await user.save();

  return res.status(201).json({
    message: "User verified successfully"
  })

}

const login = async (req, res) => {
  const {email, password} = req.body

  if(!email || !password){
    return res.status(400).json({
      message: "All fields are required."
    })
  }

  try {
    const user = await User.findOne({email})
    if(!email || !password){
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({
        message: "nvalid email or password"
      })
    }

    const token = jwt.sign({id: user._id}, 
      "shhhh",
      {
        expiresIn: '24h'
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24*60*60*1000
    }
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
      message: "Login successful",
      success: true
    })

  } catch (error) {
    return res.status(400).json({
      message: "Login failed",
      error: error.message
    })
  }

}

export { registerUser, verifyUser, login };
