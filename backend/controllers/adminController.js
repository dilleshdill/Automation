import adminRegister from "../models/adminRegister.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateAdminToken from "../utils/generateAdminToken.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer"
dotenv.config()

export const registerAdmin = async (req, res) => {
  try {
    const { adminName, email, password } = req.body;
    
    if (!adminName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await adminRegister.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminRegister({
      adminName,
      email,
      password: hashedPassword,
      adminKey: `ADMIN-${Date.now()}`,
    });
    await newAdmin.save();
    const token = generateAdminToken(newAdmin._id, newAdmin.email, "Admin");

    const transport = nodemailer.createTransport({
      service:"gmail",
      auth:{
          user:process.env.MAIL_USER,
          pass:process.env.MAIL_PASS  
      }
    })

    await transport.sendMail({
      from:process.env.MAIL_USER,
      to:email,
      subject:"Your AdminKey",
      html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="color:#333; margin-bottom:8px;">Admin Access Key</h2>

                <p>Your Admin Access Key is:</p>

                <p style="font-size:18px; font-weight:bold; color:#0a58ca;">
                  ADMIN-${Date.now()}
                </p>

                <p>Please keep this key <strong>confidential</strong>. Do not share it with anyone.</p>
                <p>It is required to log in as an <strong>Admin</strong>.</p>
              </div>
            `
    })

    return res.status(201).json({data: newAdmin._id});
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { adminKey } = req.body;

    if (!adminKey) {
      return res.status(400).json({ message: "provide all required details" });
    }

    const existingUser = await adminRegister.findOne({ adminKey });

    if (!existingUser) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    // const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    // if (!isPasswordCorrect){
    //     return res.status(400).json({message:"invalid credentials"})
    // }

    const token = generateAdminToken(existingUser._id, existingUser.email);

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "admin login successfully", data: existingUser._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminProfile = async (req, res) => {
  const { adminId } = req.body;

  const admin = await adminRegister.findById(adminId);
  console.log(admin)
  if (!admin) {
    return res.status(400).json("Admin Doesnot Exist");
  }

  res.status(200).json(admin);
};

export const getLogout = async(req,res) => {
  res.clearCookie("bidder_register_token",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  res.status(200).json("Logout Successfully")
}