const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

// 使用 dotenv 加载环境变量
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

// 模拟三个API接口
app.post("/api/xenophobic", (req, res) => {
    const text = req.body.input;
    const containsHate = text.includes("hate");
    res.json({ result: containsHate ? "Hateful content detected." : "No hateful content detected." });
});

app.post("/api/fact-check", async (req, res) => {
    const text = req.body.input;

    try {
        // 使用 axios 发送请求到 chatbot API
        const response = await axios.post(
            "https://api.openai.com/v1/completions",  // 替换为实际的 API URL
            {
                model: "gpt-3.5-turbo",  // 选择你使用的模型
                prompt: text,
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`  // 从环境变量中读取 API 密钥
                }
            }
        );

        // 返回 chatbot API 的响应
        res.json({ result: response.data.choices[0].text });
    } catch (error) {
        console.error("Error calling chatbot API:", error);
        res.status(500).json({ result: "Error fetching response from chatbot API." });
    }
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
