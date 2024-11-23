const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// 提供静态文件（假设你的静态文件位于根目录，包含 index.html、style.css、scripts.js）
app.use(express.static(path.join(__dirname)));  // `__dirname` 会指向当前目录，即 my-chatbot-project

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

// 根路径返回 index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // 返回 index.html 文件
});

// 启动服务器
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
