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
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `This is the diff for a pull request: ${diff}. Explain the changes to me`,
        },
      ],
    });

    console.log(response.data.choices[0]);

    // generateFormFile(title, response.data.choices[0].text);
  } catch (error) {
    console.log(error.response);
  }
}

module.exports = generateAIResponse;
