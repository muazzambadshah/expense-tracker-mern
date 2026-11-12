const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Expense = require("./models/Expense");
const auth = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expenseDB")
.then(() => console.log("MongoDB Connected"));

app.post("/api/auth/register", async (req, res) => {
    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });

    res.json({ message: "User Registered" });
});

app.post("/api/auth/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
});

app.post("/api/expenses", auth, async (req, res) => {
    await Expense.create({
        ...req.body,
        userId: req.user.id
    });
    res.json({ message: "Added" });
});

app.get("/api/expenses", auth, async (req, res) => {
    const data = await Expense.find({ userId: req.user.id });
    res.json(data);
});

app.delete("/api/expenses/:id", auth, async (req, res) => {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
});

app.put("/api/expenses/:id", auth, async (req, res) => {
    await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body);
    res.json({ message: "Updated" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));