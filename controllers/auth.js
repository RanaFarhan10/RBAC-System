const bcrypt = require("bcrypt");
const User = require("../model/userSchema");
const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.Signup = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (name, email, password, role).",
            });
        }

        if (!["student", "supervisor"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either 'student' or 'supervisor'.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Issue in password hashing",
            });
        }

       
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            department: department || null, 
        });

        const response = await user.save();

        return res.status(200).json({
            success: true,
            data: response,
            message: "User successfully registered",
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during signup",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password.",
            });
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please register first.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password.",
            });
        }

        const payload = {
            email: userExist.email,
            id: userExist._id,
            role: userExist.role,
        };

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        const userResponse = userExist.toObject();
        userResponse.token = token;
        userResponse.password = undefined;

        res.cookie("rana", token).status(200).json({
            success: true,
            token,
            userResponse,
            message: "Login successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed.",
        });
    }
};
