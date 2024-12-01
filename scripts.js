async function analyzeText() {
    const userInput = document.getElementById("userInput").value;

    // 调用三个后端API
    const xenophobicResult = await callAPI('/api/xenophobic', userInput);
    const factCheckResult = await callAPI('/api/fact-check', userInput);
    const harmfulContentResult = await callAPI('/api/harmful-content', userInput);

    // 更新结果
    document.getElementById("xenophobic").querySelector("p").textContent = xenophobicResult;
    document.getElementById("factCheck").querySelector("p").textContent = factCheckResult;
    document.getElementById("harmfulContent").querySelector("p").textContent = harmfulContentResult;
}

// 通用API调用函数
async function callAPI(apiEndpoint, text) {
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: text })
        });
        const data = await response.json();
        return data.result || "No response.";
    } catch (error) {
        console.error("Error calling API:", error);
        return "Error fetching result.";
    }
}
