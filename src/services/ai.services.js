const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function aiService(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: `
        You're a senior code reviewer with 7+ years of experience.
        Review the code for bugs, optimizations, structure, best practices,
        readability, and improvements. Respond cleanly and concisely.
      `,
    });

    // STREAM MODE
    const stream = await model.generateContentStream(prompt);

    let finalText = "";

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      finalText += text;
    }

    return finalText;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

module.exports = aiService;
