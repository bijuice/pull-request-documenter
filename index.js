const { Octokit } = require("octokit");
const axios = require("axios");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

//fetch env variables
const [owner, repo] = process.argv.slice(2);

async function fetchRepo() {
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
  }

  //fetch diff
  console.log("Fetching diff...");
  let diff = "";
  try {
    diff = await axios.get(diffUrl).then((res) => res.data);

    console.log(diff);
  } catch (error) {
    console.error(error);
  }
}

// fetchRepo();
