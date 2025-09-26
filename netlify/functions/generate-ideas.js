const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access the API key from Netlify environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request must include a 'prompt'." }),
      };
    }
    
    // Use a newer, recommended model like 'gemini-1.5-flash-latest'.
    // This is generally faster and more cost-effective.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Send the successful result back to the website
    return {
      statusCode: 200,
      // The response from the new SDK is already structured correctly.
      // We can directly stringify the candidate's content.
      body: JSON.stringify(response.candidates[0]),
    };

  } catch (error) {
    // Log the detailed error for better debugging
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "An internal error occurred.",
        details: error.message 
      }),
    };
  }
};
