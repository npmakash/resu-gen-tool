import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  major: { type: String, default: '' },
  dates: { type: String, default: '' },
  location: { type: String, default: '' },
  gpa: { type: String, default: '' }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  dates: { type: String, default: '' },
  location: { type: String, default: '' },
  bullets: [{ type: String }]
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tech: { type: String, default: '' },
  dates: { type: String, default: '' },
  link: { type: String, default: '' },
  bullets: [{ type: String }]
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  personal: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: {
    languages: { type: String, default: '' },
    frameworks: { type: String, default: '' },
    databases: { type: String, default: '' },
    tools: { type: String, default: '' },
    concepts: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
