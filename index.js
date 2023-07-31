const dotenv = require("dotenv");
const fetchDiffDetails = require("./services/fetchDiffDetails");
const fetchDiff = require("./services/fetchDiff");
const generateAIResponse = require("./services/generateAIResponse");

async function main() {
  dotenv.config();

  const { GITHUB_TOKEN, OPENAI_API_KEY } = process.env;

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

  //fetch diff url from latest pull request
  const { diffUrl, title } = await fetchDiffDetails({
    GITHUB_TOKEN,
    owner,
    repo,
  });

  //fetch diff
  const diff = await fetchDiff(diffUrl);

  //generate AI response
  await generateAIResponse({ OPENAI_API_KEY, diff, title });
}

main();
