const fs = require("fs");

function generateFormFile(title, content) {
  fs.writeFile(`./${title}.txt`, content, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("The file was saved!");
  });
}

module.exports = generateFormFile;
