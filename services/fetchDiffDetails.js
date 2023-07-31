const { Octokit } = require("octokit");

async function fetchDiffDetails({ GITHUB_TOKEN, owner, repo }) {
  console.log("Fetching latest pull request...");

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  try {
    const resp = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner,
      repo,
    });

    if (resp.data.length === 0) {
      console.log("No pull requests found.");
      throw new Error("No pull requests found.");
    }

    return {
      diffUrl: resp.data[0].diff_url,
      title: resp.data[0].title,
    };
  } catch (error) {
    console.log(error);
    if (error.response?.status === 404) {
      throw new Error(
        "Repo not found. Please check if repo is private and if GITHUB_TOKEN has access to it. "
      );
    }

    throw new Error("Unable to fetch repo");
  }
}

module.exports = fetchDiffDetails;
