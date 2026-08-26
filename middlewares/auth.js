const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {

        const token = req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload; 
        } catch (error) {
            return res.status(402).json({
                success: false,
                message: "Invalid Token",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying authentication",
        });
    }
};

exports.isStudent = (req, res, next) => {
    try {
        
        if (req.user.role !== "student") {
            return res.status(500).json({
                success: false,
                message: "This is a protected route for students only",
            });
        }
        next(); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matched",
        });
    }
};


exports.isSupervisor = (req, res, next) => {
    try {
        
        if (req.user.role !== "supervisor") {
            return res.status(500).json({
                success: false,
                message: "This is a protected route for supervisors only",
            });
        }
        next(); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matched",
        });
    }
};
