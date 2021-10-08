const { chromium } = require(`playwright-chromium`);
const xlsx = require("xlsx");
const spreadsheet = xlsx.readFile('./Internetanbieter Research All Countries.xlsx');
const sheets = spreadsheet.SheetNames;
const secondSheet = spreadsheet.Sheets[sheets[0]]; //sheet 1 is index 0
const expect = require(`mocha`);


(async () => {

    // const { test, expect } = require('@playwright/test');
    let names = [];
    let links = [];

    for (let i = 2; ; i++) {
        const firstColumn = secondSheet['A' + i];
        if (!firstColumn) {
            break;
        }
        names.push(firstColumn.h);
    }

    for (let i = 2; ; i++) {
        const firstColumn = secondSheet['F' + i];
        if (!firstColumn) {
            break;
        }
        links.push(firstColumn.h);
    }


    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultTimeout(6000)

    await page.goto('(***********************)');

    await page.click('[placeholder="Username"]');

    await page.fill('[placeholder="Username"]', '*******');

    await page.click('[placeholder="Password"]');

    await page.fill('[placeholder="Password"]', '**********');

    await page.click('text=Login');
    //expect(page.url()).toBe('******************************');
    await page.waitForTimeout(1000);

    await page.goto(`******************`)


    for (let index = 0; index < links.length; index++) {
        try {
            if (links[index] === ``){
                continue;
            }
            await page.click('input[role="textbox"]');
            await page.fill('input[role="textbox"]', `${names[index]}`);
            await page.waitForTimeout(3000);

            //JUST FOR THE EXPORT
            // await page.click('li:nth-child(1)');
            await page.click(`text=${names[index]}`);
            
            //IG
            //FB
            //NOTHING/
            //TT
            //TR
            //VM
            await page.selectOption('select[name="service"]', 'TR');
            // Select 3
            await page.selectOption('select[name="priority"]', '3');

            await page.click('textarea[name="name"]');
            await page.fill('textarea[name="name"]', `${links[index]}`);
            await page.waitForTimeout(1000);
            await page.click('input:has-text("Submit")');
            await page.waitForTimeout(1000);
            await page.goto(`**************`)
            await page.waitForTimeout(3000);
            continue;

        } catch (error) {
            await page.click(`text="Create Account"`)

            await page.click('[placeholder="Enter Account Name..."]');

            await page.fill('[placeholder="Enter Account Name..."]', `${names[index]}`);

            await page.click('text=Submit');

            await page.waitForTimeout(1000);
            index--
            await page.goto(`*****************`)
            await page.waitForTimeout(1000);
            continue;
        }
    }

    browser.close();

})();