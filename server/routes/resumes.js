import express from 'express';
import Resume from '../models/Resume.js';

const router = express.Router();

// Middleware to check if user-id is present in request headers
const checkAuth = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. User session header missing.' });
  }
  req.userId = userId;
  next();
};

// 1. Get all resumes for the active user
router.get('/', checkAuth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Internal server error while fetching portfolios.' });
  }
});

// 2. Create a new resume
router.post('/', checkAuth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Resume title is required.' });
    }

    const newResume = new Resume({
      userId: req.userId,
      title,
      personal: { name: '', email: '', phone: '', github: '', linkedin: '', website: '', summary: '' },
      education: [],
      experience: [],
      projects: [],
      skills: { languages: '', frameworks: '', databases: '', tools: '', concepts: '' }
    });

    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Internal server error while creating resume.' });
  }
});

// 3. Update an existing resume
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, personal, education, experience, projects, skills } = req.body;

    const resume = await Resume.findOne({ _id: id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume portfolio not found.' });
    }

    // Update fields
    if (title !== undefined) resume.title = title;
    if (personal !== undefined) resume.personal = personal;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (projects !== undefined) resume.projects = projects;
    if (skills !== undefined) resume.skills = skills;

    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Internal server error while updating resume.' });
  }
});

// 4. Delete a resume
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Resume.deleteOne({ _id: id, userId: req.userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Resume portfolio not found.' });
    }

    res.json({ message: 'Resume portfolio deleted successfully.' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Internal server error while deleting portfolio.' });
  }
});

export default router;
