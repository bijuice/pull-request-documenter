# Pull Request Documenter

A simple documentation script that fetches the latest pull request from a repo and creates a summary of the changes within the request.

## Requirements

1. Node,js
2. GitHub personal access token. You can generate one [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
3. Open AI API key. You can generate one [here](https://platform.openai.com/account/api-keys)

## Installation

1. Clone the repo
2. `cd pull-request-documenter`
3. `npm install`
4. Create a `.env` file in the root of the project and add the following:

```
OPENAI_API_KEY=<Your Open AI API Key>
GITHUB_TOKEN=<Your GitHub Personal Access Token>
```

## Usage

`node index.js <username> <repo>`

The script takes 2 arguments: the username of the repo owner and the name of the repo. For example, if you wanted to generate a change request form for this repo, you would run: `node index.js bijuice pull-request-documenter`

A .txt file with the title of the pull request will be generated in the root folder.
