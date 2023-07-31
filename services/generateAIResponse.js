const { Configuration, OpenAIApi } = require("openai");
const generatePrompt = require("../utilities/generatePrompt");
const generateFormFile = require("../utilities/generateFormFile");

async function generateAIResponse({ OPENAI_API_KEY, diff, title }) {
  console.log("Generating documentation...");

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(diff),
      temperature: 0,
      max_tokens: 1000,
    });

    console.log(response);

    generateFormFile(title, response.data.choices[0].text);
  } catch (error) {
    console.log(error);
    if (error.response) {
      throw new Error(error.response.status, error.response.data);
    }

    throw new Error(`Error with OpenAI API request: ${error.message}`);
  }
}

module.exports = generateAIResponse;
