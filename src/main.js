require("dotenv").config();
const ScrapeFlow = require("./scrapeFlow");

function main() {
  new ScrapeFlow().exec();
}

main();
