const { Octokit } = require("octokit");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const fetchDiff = require("./services/fetchDiff");
const generateFormFile = require("./utilities/generateFormFile");
const generatePrompt = require("./utilities/generatePrompt");

dotenv.config();

const { GITHUB_TOKEN, OPENAI_API_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//fetch command line params
const [owner, repo] = process.argv.slice(2);

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN not found");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

if (!owner || !repo) {
  throw new Error(
    "Please provide owner and repo in command line arguments. See README.md for more info. "
  );
}

async function main() {
  //fetch diff url from latest pull request
  const { diffUrl, title } = await fetchDiff({ GITHUB_TOKEN, owner, repo });

  console.log(diffUrl, title);
}

// //fetch diff
// console.log("Fetching diff...")
// let diff = ""
// try {
//   diff = await axios.get(diffUrl).then((res) => res.data)
// } catch (error) {
//   throw new Error(error)
// }

// //generate explanation
// console.log("Generating documentation...")
// try {
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: generatePrompt(diff),
//     temperature: 0,
//     max_tokens: 1000,
//   })

//   generateFormFile(title, response.data.choices[0].text)
// } catch (error) {
//   if (error.response) {
//     throw new Error(error.response.status, error.response.data)
//   }

//   throw new Error(`Error with OpenAI API request: ${error.message}`)
// }
