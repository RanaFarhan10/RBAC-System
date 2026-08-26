const express = require("express");
const router = express.Router();

const { Signup, login } = require("../controllers/auth");
const { auth, isStudent, isSupervisor } = require("../middlewares/auth");
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/project");


router.post("/users/register", Signup);
router.post("/users/login", login);

`router.get("/student", auth, isStudent, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for students",
    });
});`

router.get("/supervisor", auth, isSupervisor, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for supervisors",
    });
});

router.get("/test", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for testing",
    });
});

router.post("/projects", createProject);
router.get("/projects", auth, getProjects);
router.get("/projects/:id", auth, getProjectById);
router.put("/projects/:id", auth, isSupervisor, updateProject);
router.delete("/projects/:id", auth, isSupervisor, deleteProject);

module.exports = router;
