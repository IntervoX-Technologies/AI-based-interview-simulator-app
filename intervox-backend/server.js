const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. New SDK: Import Groq instead of Google GenAI
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// 2. Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY // Ensure you added this to your .env
});

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'intervox_db'
});

db.connect(err => {
    if (err) console.log("❌ Database Error: " + err.message);
    else console.log("✅ MySQL Connected (IntervoX DB)...");
});

// --- AUTHENTICATION APIS ---

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) return res.json({ success: false, message: err.message });
            res.json({ success: true });
        });
    } catch (error) {
        res.json({ success: false, message: 'Error hashing password' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) return res.json({ success: false, message: "User not found" });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Wrong password" });
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email }, token });
    });
});
// API to get real-time stats for the dashboard
app.get('/api/user-stats/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // This query calculates all 3 stats in one go
    const sql = `
        SELECT 
            COUNT(*) as completed, 
            IFNULL(ROUND(AVG(score)), 0) as avgScore,
            (COUNT(*) * 5) as totalQuestions 
        FROM interview_history 
        WHERE user_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, stats: results[0] });
    });
});

app.get('/api/user-history/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT category, score, feedback, created_at FROM interview_history WHERE user_id = ? ORDER BY created_at DESC";

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, history: results });
    });
});

// --- AI INTERVIEW APIS (Groq Llama 3.3 Syntax) ---

// 1. Generate Question API
app.post('/api/generate-question', async (req, res) => {
    const type = req.body.type || "General"; 

    try {
        console.log(`Generating ${type} question...`);
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert HR interviewer for IntervoX." },
                { role: "user", content: `Provide ONE unique and professional ${type} interview question for a fresh graduate. Return ONLY the question text.` }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const question = chatCompletion.choices[0].message.content;
        console.log("✅ AI Question Success!");
        res.json({ question });

    } catch (error) {
        console.error("❌ Groq Error:", error.message);
        const fallbacks = {
            HR: "Tell me about a time you overcame a challenge.",
            Technical: "Explain the difference between SQL and NoSQL databases.",
            Behavioral: "How do you prioritize your tasks when under pressure?"
        };
        res.json({ question: fallbacks[type] || "What are your career goals?" });
    }
});
// Inside your save route in server.js
app.post('/api/save-session', (req, res) => {
    const { userId, score, category, feedback } = req.body;

    const sql = "INSERT INTO interview_history (user_id, score, category, feedback) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [userId, score, category, feedback], (err, result) => {
        if (err) return res.status(500).json({ success: false });

        // 📢 REAL-TIME TRIGGER:
        // This sends a signal to all connected clients that data has changed
        io.emit('update_analytics', { userId: userId }); 

        res.json({ success: true, message: "Data saved to history!" });
    });
});

// 2. Evaluation API
app.post('/api/evaluate-answer', async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ feedback: "Data missing" });

    try {
        console.log("Evaluating user answer...");
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: 'user', 
                    content: `Context: Professional Interview on IntervoX. Question: ${question}. User Answer: ${answer}. Evaluate this response. Provide: 1. A score out of 10. 2. Two specific strengths. 3. Two specific areas for improvement.` 
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        console.log("✅ Evaluation Success!");
        res.json({ feedback: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error("❌ Groq Error:", error.message);
        res.json({ feedback: "AI evaluation unavailable. Focus on using the STAR method!" });
    }
});

// Simple home route for verification
app.get('/', (req, res) => res.send("🚀 IntervoX Backend is LIVE with Groq AI!"));

app.listen(5000, "0.0.0.0", () => {
    console.log("🚀 Server running on http://localhost:5000");
});