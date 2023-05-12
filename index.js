const { Octokit } = require("octokit");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//fetch command line params
const [owner, repo] = process.argv.slice(2);

async function fetchRepo() {
  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN not found");
    return;
  }

  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not found");
    return;
  }

  if (!owner || !repo) {
    console.error(
      "Please provide owner and repo in command line arguments. See README.md for more info. "
    );
    return;
  }

  //fetch diff url from latest pull request
  console.log("Fetching latest pull request...");
  let diffUrl = "";
  try {
    diffUrl = await octokit
      .request("GET /repos/{owner}/{repo}/pulls", {
        owner: "bijuice",
        repo: "portfolio-v2",
      })
      .then((res) => res.data[0].diff_url);
  } catch (error) {
    console.error("Unable to fetch repo");
    return;
  }

  //fetch diff
  console.log("Fetching diff...");
  let diff = "";
  try {
    diff = await axios.get(diffUrl).then((res) => res.data);
  } catch (error) {
    console.error(error);
    return;
  }

  //generate explanation
  console.log("Generating explanation...");
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(diff),
      temperature: 0.6,
    });

    console.log(completion.data.choices);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return;
    }

    console.error(`Error with OpenAI API request: ${error.message}`);
    return;
  }
}

function generatePrompt(diff) {
  const prompt = `This is the diff for a pull request. I want you to explain the changes in plain english without explaining what the code does.\n ${diff} \n`;

  return prompt;
}

fetchRepo();
