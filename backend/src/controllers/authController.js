const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "ai_resume_builder_jwt_secret_key_2026";

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: "Please fill in all fields (name, email, password)." });
      }

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ ok: false, message: "An account already exists for this email." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        ok: true,
        message: "Account registered successfully.",
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error("Register error:", error.message);
      res.status(500).json({ ok: false, message: "Internal server error during registration." });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ ok: false, message: "Please provide both email and password." });
      }

      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(400).json({ ok: false, message: "Invalid email or password." });
      }

      // Validate password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ ok: false, message: "Invalid email or password." });
      }

      // Generate token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        ok: true,
        message: "Welcome back.",
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ ok: false, message: "Internal server error during login." });
    }
  },

  async getMe(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found." });
      }
      res.json({
        ok: true,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error("GetMe error:", error.message);
      res.status(500).json({ ok: false, message: "Internal server error fetching user profile." });
    }
  }
};

module.exports = authController;
