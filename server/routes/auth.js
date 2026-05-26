import express from 'express';
import User from '../models/User.js';
import Resume from '../models/Resume.js';

const router = express.Router();

// Helper to generate 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. Send OTP for Login or Signup
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, password, isLogin } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: trimmedEmail });
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (isLogin) {
      // Login Flow
      if (!user) {
        return res.status(404).json({ error: 'No account found with this email. Please sign up.' });
      }
      
      // Simple plain text password check for demo simplicity (or bcrypt if needed, but plain text is sufficient for mock authentication systems in custom local tools)
      if (password && user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Signup Flow
      if (user) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
      if (!name || !password) {
        return res.status(400).json({ error: 'Name and Password are required for registration.' });
      }

      // Create a temporary user or update user details with signup credentials
      user = new User({
        email: trimmedEmail,
        name,
        password,
        otp,
        otpExpires
      });
      await user.save();
    }

    // Log the OTP to terminal for developer visibility
    console.log(`\n======================================================`);
    console.log(`[OTP DISPATCH] Email: ${trimmedEmail}`);
    console.log(`[OTP DISPATCH] Code: ${otp}`);
    console.log(`======================================================\n`);

    // Return the OTP in response for client-side demo helper
    res.json({ 
      message: `OTP sent successfully to ${trimmedEmail}!`,
      simulatedOtp: otp // Returned directly so they don't have to check the server logs if testing in UI
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({ error: 'Internal server error during OTP dispatch.' });
  }
});

// 2. Verify OTP and Log In / Complete Signup
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ error: 'Verification code has expired.' });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Check if user has an initial resume, if not, create a default one
    const resumesCount = await Resume.countDocuments({ userId: user._id });
    if (resumesCount === 0) {
      const defaultResume = new Resume({
        userId: user._id,
        title: 'Primary Resume',
        personal: {
          name: user.name,
          email: user.email,
          phone: '',
          github: '',
          linkedin: '',
          website: '',
          summary: ''
        },
        education: [],
        experience: [],
        projects: [],
        skills: { languages: '', frameworks: '', databases: '', tools: '', concepts: '' }
      });
      await defaultResume.save();
    }

    res.json({
      message: 'Authentication successful!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ error: 'Internal server error during OTP verification.' });
  }
});

// 3. Send OTP for Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    console.log(`\n======================================================`);
    console.log(`[PASSWORD RESET OTP] Email: ${trimmedEmail}`);
    console.log(`[PASSWORD RESET OTP] Code: ${otp}`);
    console.log(`======================================================\n`);

    res.json({
      message: `Password reset verification code sent to ${trimmedEmail}!`,
      simulatedOtp: otp
    });

  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 4. Verify Reset OTP and Save New Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ error: 'Verification code has expired.' });
    }

    // Save new password and clear OTP
    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      message: 'Password reset successful! You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
