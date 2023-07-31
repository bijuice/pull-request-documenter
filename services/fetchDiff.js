const { default: axios } = require("axios");

async function fetchDiff(diffUrl) {
  //fetch diff
  console.log("Fetching diff...");

  const resp = await axios.get(diffUrl);

  return resp.data;
}

module.exports = fetchDiff;
