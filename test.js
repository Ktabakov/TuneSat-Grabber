const xlsx = require("xlsx");
const spreadsheet = xlsx.readFile('./Advertisement Germany Facebook Scrape.xlsx');
const sheets = spreadsheet.SheetNames;
const firstSheet = spreadsheet.Sheets[sheets[0]]; //sheet 1 is index 0

let links = [];

for (let i = 1; ; i++) {
  const firstColumn = firstSheet['A' + i];
  if (!firstColumn) {
    break;
  }
  links.push(firstColumn.h);
}
 console.log(links.join(`\n`));