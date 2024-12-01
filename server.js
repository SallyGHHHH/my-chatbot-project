// 导入所需模块
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 存储 API 状态
let modelStatus = {
    xenophobic: {
        status: false,
        description: "Detects and analyzes xenophobic language in text"
    },
    factCheck: {
        status: false,
        description: "Verifies factual accuracy of statements"
    },
    harmful: {
        status: false,
        description: "Identifies potentially harmful content"
    }
};

// OpenAI API 调用函数
async function callOpenAI(text, modelId, apiKey) {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: modelId,
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

// 统一的 API 验证函数
async function validateModels() {
    const testText = "this is test";
    
    try {
        // 测试仇外语言检测模型
        try {
            await callOpenAI(testText, process.env.Xenophobic_MODEL_ID, process.env.Xenophobic_API_KEY);
            modelStatus.xenophobic.status = true;
            console.log('Xenophobic model and API key validated');
        } catch (error) {
            modelStatus.xenophobic.status = false;
            modelStatus.xenophobic.description = error.response?.data?.error?.message || error.message;
            console.error('Xenophobic validation failed:', modelStatus.xenophobic.description);
        }

        // 测试事实核查模型
        try {
            await callOpenAI(testText, process.env.Fact_MODEL_ID, process.env.Fact_API_KEY);
            modelStatus.factCheck.status = true;
            console.log('Fact Check model and API key validated');
        } catch (error) {
            modelStatus.factCheck.status = false;
            modelStatus.factCheck.description = error.response?.data?.error?.message || error.message;
            console.error('Fact Check validation failed:', modelStatus.factCheck.description);
        }

        // 测试有害内容分析模型
        try {
            await callOpenAI(testText, process.env.Harmful_MODEL_ID, process.env.Harmful_API_KEY);
            modelStatus.harmful.status = true;
            console.log('Harmful Content model and API key validated');
        } catch (error) {
            modelStatus.harmful.status = false;
            modelStatus.harmful.description = error.response?.data?.error?.message || error.message;
            console.error('Harmful Content validation failed:', modelStatus.harmful.description);
        }

    } catch (error) {
        console.error('Error during model validation:', error);
    }
}

// 仇外语言检测API
app.post("/api/xenophobic", async (req, res) => {
    try {
        const text = req.body.input;
        if (!text) {
            return res.status(400).json({ error: "Input text is required" });
        }

        const result = await callOpenAI(text, process.env.Xenophobic_MODEL_ID, process.env.Xenophobic_API_KEY);
        res.json({ result });
        console.log('Xenophobic Analysis Result:', result);
    } catch (error) {
        modelStatus.xenophobic.status = false;
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

        const result = await callOpenAI(text, process.env.Fact_MODEL_ID, process.env.Fact_API_KEY);
        res.json({ result });
        console.log('Fact Check Result:', result);
    } catch (error) {
        modelStatus.factCheck.status = false;
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

        const result = await callOpenAI(text, process.env.Harmful_MODEL_ID, process.env.Harmful_API_KEY);
        res.json({ result });
        console.log('Harmful Content Result:', result);
    } catch (error) {
        modelStatus.harmful.status = false;
        console.error("Error calling OpenAI API:", error.response?.data?.error?.message || error.message);
        res.status(500).json({ error: "Error analyzing content" });
    }
});

// 状态检查端点
app.get("/api/status", (req, res) => {
    res.json(modelStatus);
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

// 启动服务器并验证模型
const PORT = process.env.PORT;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await validateModels();
    console.log('Initial model status:', modelStatus);
});
