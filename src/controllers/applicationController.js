const db = require("../models");
const Application = db.application;
const createApplication = async (req, res) => {
  try {
    const { recuritmentPost_id, CV, content } = req.body;
    const newApplication = await Application.create({
      recuritmentPost_id,
      content,
      CV,
      status: "Đang chờ",
    });
    res
      .status(201)
      .json({
        message: "Application created successfully",
        application: newApplication,
      });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Error creating application" });
  }
};

module.exports = { createApplication };
