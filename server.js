const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 模拟三个API接口
app.post("/api/xenophobic", (req, res) => {
    const text = req.body.input;
    const containsHate = text.includes("hate");
    res.json({ result: containsHate ? "Hateful content detected." : "No hateful content detected." });
});

app.post("/api/fact-check", (req, res) => {
    const text = req.body.input;
    res.json({ result: `Fact-checking completed: "${text}" seems plausible.` });
});

app.post("/api/harmful-content", (req, res) => {
    const text = req.body.input;
    const isHarmful = text.length > 50;
    res.json({ result: isHarmful ? "Potential harmful content detected." : "Content appears safe." });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
app.get("/", (req, res) => {
    res.send("Server is running!");
});
