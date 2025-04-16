const Exam = require('../models/Exam');
const Result = require('../models/Result');

// Get all exams (with optional filtering)
exports.getExams = async (req, res) => {
  try {
    const { subject, level, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = {};
    if (subject) filter.subject = subject;
    if (level) filter.level = level;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const exams = await Exam.find(filter)
      .sort({ date: -1 })
      .populate('createdBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving exams',
      error: error.message
    });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving exam',
      error: error.message
    });
  }
};

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { name, subject, totalMarks, date, level } = req.body;

    // Basic validation
    if (!name || !subject || !totalMarks || !date || !level) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const exam = new Exam({
      name,
      subject,
      totalMarks,
      date: new Date(date),
      level,
      createdBy: req.user.id // Assuming user ID is available from auth middleware
    });

    await exam.save();

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: error.message
    });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  try {
    const { name, subject, totalMarks, date, level } = req.body;
    const examId = req.params.id;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if totalMarks is being changed
    const marksChanged = totalMarks && totalMarks !== exam.totalMarks;

    // Update exam
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { name, subject, totalMarks, date, level },
      { new: true, runValidators: true }
    );

    // If totalMarks changed, update all related results
    if (marksChanged) {
      const results = await Result.find({ exam: examId });
      
      for (const result of results) {
        const newPercentage = (result.marksObtained / totalMarks) * 100;
        await Result.findByIdAndUpdate(result._id, {
          percentage: newPercentage
        });
      }
    }

    res.status(200).json({
      success: true,
      data: updatedExam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating exam',
      error: error.message
    });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // Check for existing results
    const resultCount = await Result.countDocuments({ exam: examId });
    if (resultCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete exam with existing results'
      });
    }

    const exam = await Exam.findByIdAndDelete(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exam',
      error: error.message
    });
  }
};

// Get exam statistics 
exports.getExamStats = async (req, res) => {
  try {
    const examId = req.params.id;

    // Get all results for this exam
    const results = await Result.find({ exam: examId });
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found for this exam'
      });
    }

    // Calculate statistics
    const totalStudents = results.length;
    const marks = results.map(r => r.marksObtained);
    const percentages = results.map(r => r.percentage);

    const stats = {
      totalStudents,
      highestMarks: Math.max(...marks),
      lowestMarks: Math.min(...marks),
      averageMarks: marks.reduce((a, b) => a + b) / totalStudents,
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      averagePercentage: percentages.reduce((a, b) => a + b) / totalStudents,
      passCount: results.filter(r => r.percentage >= 50).length,
      distribution: {
        'HIGHLY PROFICIENT': results.filter(r => r.percentage >= 80).length,
        'PROFICIENT': results.filter(r => r.percentage >= 70 && r.percentage < 80).length,
        'APPROACHING PROFICIENCY': results.filter(r => r.percentage >= 60 && r.percentage < 70).length,
        'DEVELOPING': results.filter(r => r.percentage >= 50 && r.percentage < 60).length,
        'EMERGING': results.filter(r => r.percentage < 50).length
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting exam statistics',
      error: error.message
    });
  }
};

// Schedule upcoming exams
exports.scheduleExam = async (req, res) => {
  try {
    const { name, subject, totalMarks, date, level, schedule } = req.body;

    // Validate schedule information
    if (!schedule || !schedule.startTime || !schedule.duration || !schedule.venue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete schedule information'
      });
    }

    // Create exam with schedule information
    const exam = new Exam({
      name,
      subject,
      totalMarks,
      date: new Date(date),
      level,
      schedule: {
        startTime: schedule.startTime,
        duration: schedule.duration, // in minutes
        venue: schedule.venue,
        instructions: schedule.instructions || []
      },
      createdBy: req.user.id
    });

    await exam.save();

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error scheduling exam',
      error: error.message
    });
  }
};