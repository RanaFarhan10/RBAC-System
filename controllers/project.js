const Project = require("../model/projectSchema");
const User = require("../model/userSchema"); 

exports.createProject = async (req, res) => {
    try {
        
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can create projects"
            });
        }

        const { title, description } = req.body;

        const newProject = new Project({
            title,
            description,
            user: req.user.id
        });

        await newProject.save();

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
};


exports.getProjects = async (req, res) => {
    try {
        if (req.user.role === "student") {
            
            const projects = await Project.find({ user: req.user.id });
            return res.status(200).json({
                success: true,
                data: projects
            });
        }

        if (req.user.role === "supervisor") {
           
            const projects = await Project.find();
            return res.status(200).json({
                success: true,
                data: projects
            });
        }

        return res.status(403).json({
            success: false,
            message: "Invalid role"
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (req.user.role === "student" && project.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own project"
            });
        }

       
        if (req.user.role === "supervisor") {
            return res.status(200).json({
                success: true,
                data: project
            });
        }

        return res.status(403).json({
            success: false,
            message: "You do not have permission to view this project"
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        });
    }
};


exports.updateProject = async (req, res) => {
    try {
        if (req.user.role !== "supervisor") {
            return res.status(403).json({
                success: false,
                message: "Only supervisors can update projects"
            });
        }

        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update project"
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        if (req.user.role !== "supervisor") {
            return res.status(403).json({
                success: false,
                message: "Only supervisors can delete projects"
            });
        }

        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });
    }
};
