const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.post('/generate', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt is required' });
//     }

//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent([prompt]);

//     // Send the response from the model back to the frontend
//     res.status(200).json({ response: result.response.text() });
//   } catch (error) {
//     console.error('Error generating content:', error);
//     res.status(500).json({ error: 'Failed to generate content' });
//   }
// });
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
})
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Add context to the user's input
    const mentalHealthContext = `
      You are a mental health assistant. Respond to user prompts in a way that supports their mental well-being. 
      Ask questions to understand their mental state and provide short, concise responses (5-6 lines) with actionable advice. 
      Avoid mentioning helpline numbers, specific departments, or unrelated topics. Always respond empathetically.
    `;
    const contextualPrompt = `${mentalHealthContext}\nUser: ${prompt}`;
   
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([contextualPrompt]);
   
   
    const responseText = result.response.text();

    // Send the response back to the frontend
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Vercel requires this specific export
module.exports = app;