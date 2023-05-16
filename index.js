const { Octokit } = require("octokit")
const axios = require("axios")
const { Configuration, OpenAIApi } = require("openai")
const dotenv = require("dotenv")
const generateFormFile = require("./utilities/generateFormFile")

dotenv.config()

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

//fetch command line params
const [owner, repo] = process.argv.slice(2)

async function fetchRepo() {
  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN not found")
    return
  }

  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not found")
    return
  }

  if (!owner || !repo) {
    console.error(
      "Please provide owner and repo in command line arguments. See README.md for more info. "
    )
    return
  }

  //fetch diff url from latest pull request
  console.log("Fetching latest pull request...")
  let diffUrl = ""
  let title = ""
  try {
    await octokit
      .request("GET /repos/{owner}/{repo}/pulls", {
        owner: "bijuice",
        repo: "portfolio-v2",
      })
      .then((res) => {
        if (res.data.length === 0) {
          console.error("No pull requests found.")
          return
        }

        diffUrl = res.data[0].diff_url
        title = res.data[0].title
      })
  } catch (error) {
    if (error.response?.status === 404) {
      console.error(
        "Repo not found. Please check if repo is private and if GITHUB_TOKEN has access to it. "
      )
      return
    }

    console.error("Unable to fetch repo")
    return
  }

  //fetch diff
  console.log("Fetching diff...")
  let diff = ""
  try {
    diff = await axios.get(diffUrl).then((res) => res.data)
  } catch (error) {
    console.error(error)
    return
  }

  //generate explanation
  console.log("Generating documentation...")
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(diff),
      temperature: 0,
      max_tokens: 1000,
    })

    generateFormFile(title, response.data.choices[0].text)
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return
    }

    console.error(`Error with OpenAI API request: ${error.message}`)
    return
  }
}

function generatePrompt(diff) {
  const prompt = `This is the diff for a pull request:\n ${diff} \n I want you to create a change request form based on the information in the pull request. The change request form should answer the following questions:\n1.Reason for change.\n2. Desired outcome of change.\n3.Rollout plan.\n4.Backout or Rollback Plan\n5. Services/Applications Affected.\n6.Users/Departments Affected\n7.Resource Requirements\n8.Communication Plan\n9.Test Details`

  return prompt
}

fetchRepo()
