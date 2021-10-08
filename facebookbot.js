const { chromium } = require(`playwright-chromium`);
var excel = require('excel4node');
var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');

const xlsx = require("xlsx");
const spreadsheet = xlsx.readFile('./artsfrance.xlsx');
const sheets = spreadsheet.SheetNames;
const firstSheet = spreadsheet.Sheets[sheets[0]]; //sheet 1 is index 0

(async () => {

  let links = [];

  for (let i = 1; ; i++) {
    const firstColumn = firstSheet['A' + i];  
    if (!firstColumn) {
      break;
    }
    links.push(firstColumn.h);
  }
  let names = [];
  let baseURL = `https://www.facebook.com/`;

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.facebook.com/");
  await page.click('[data-testid="cookie-policy-dialog-accept-button"]');

  await page.click('[data-testid="royal_email"]');
  await page.fill('[data-testid="royal_email"]', '**********');
  await page.click('[data-testid="royal_pass"]');

  await page.fill('[data-testid="royal_pass"]', '*********');

  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.facebook.com/' }*/),
    page.click('[data-testid="royal_login_button"]')
  ]);

  // await Promise.all([
  //   page.waitForNavigation(/*{ url: 'https://www.facebook.com/user_cookie_prompt/' }*/),
  //   page.click('[aria-label="Alle Cookies erlauben"]')
  // ]);
  // // Click [aria-label="Alle Cookies erlauben"]
  // await Promise.all([
  //   page.waitForNavigation(/*{ url: 'https://www.facebook.com/' }*/),
  //   page.click('[aria-label="Alle Cookies erlauben"]')
  // ]);


  for (let index = 0; index < links.length; index++) {
    await page.goto(baseURL + links[index]);
    await page.waitForTimeout(1000);

    let items = await page.evaluate(() => {
      try {
        const heading = document.querySelectorAll(".d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.embtmqzv.fe6kdd0r.mau55g9w.c8b282yb.hrzyx87i.m6dqt4wy.h7mekvxk.hnhda86s.oo9gr5id.hzawbc8m");
        if (heading === undefined) {
          return `UNAVAILABLE`;
        }
        let item = heading[0].textContent;
        return item;
      } catch (error) {
        return `UNAVAILABLE`;
      }
    });
    names.push(items);
  }

  for (let index = 0; index < names.length; index++) {
    if (index === 0) {
      worksheet.cell(index + 1, index + 1).string(names[index])
      worksheet.cell(index + 1, index + 2).string(links[index])
    } else {
      worksheet.cell(index + 1, 1).string(names[index])
      worksheet.cell(index + 1, 2).string(links[index])
    }

  }
  workbook.write('Names.xlsx');

  browser.close();
})();