// 导入所需模块
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// OpenAI API 调用函数（仅使用 API Key）
async function callOpenAIWithKey(text, apiKey) {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            messages: [{ role: "user", content: text }],
            temperature: 0.7,
            max_tokens: 500
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.choices[0].message.content;
}

// 仇外语言检测API
app.post("/api/xenophobic", async (req, res) => {
    try {
        const text = req.body.input;
        if (!text) {
            return res.status(400).json({ error: "Input text is required" });
        }

        const result = await callOpenAIWithKey(text, process.env.Xenophobic_API_KEY);
        res.json({ result });
        console.log('Xenophobic Analysis Result:', result);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response?.data?.error?.message || error.message);
        res.status(500).json({ error: "Error analyzing content" });
    }
});

// 事实核查API
app.post("/api/fact-check", async (req, res) => {
    try {
        const text = req.body.input;
        if (!text) {
            return res.status(400).json({ error: "Input text is required" });
        }

        const result = await callOpenAIWithKey(text, process.env.Fact_API_KEY);
        res.json({ result });
        console.log('Fact Check Result:', result);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response?.data?.error?.message || error.message);
        res.status(500).json({ error: "Error analyzing content" });
    }
});

// 有害内容检测API
app.post("/api/harmful-content", async (req, res) => {
    try {
        const text = req.body.input;
        if (!text) {
            return res.status(400).json({ error: "Input text is required" });
        }

        const result = await callOpenAIWithKey(text, process.env.Harmful_API_KEY);
        res.json({ result });
        console.log('Harmful Content Result:', result);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response?.data?.error?.message || error.message);
        res.status(500).json({ error: "Error analyzing content" });
    }
});

// 状态检查端点
app.get("/api/status", (req, res) => {
    res.json({ status: "API keys are configured, and endpoints are functional." });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 根路径返回 index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
