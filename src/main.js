require("dotenv").config();
const ScrapeFlow = require("./scrape_flow");

function main() {
  new ScrapeFlow().exec();
}

main();
