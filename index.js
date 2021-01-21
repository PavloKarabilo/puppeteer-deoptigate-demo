const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const {exec} = require('child_process');


const runDeoptigate = () => {
    exec('./node_modules/.bin/deoptigate', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        process.exit(0);
    });
}

(async () => {
  let res = await inquirer.prompt([{type: 'input', name: 'url', message: 'Please enter URL'}]);
  const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
          '--disable-extensions',
          '--incognito',
          '--no-sandbox',
          '--js-flags="--prof --log-all --no-logfile-per-isolate --logfile=' + __dirname + 'v8.log',
      ]
  });

  console.log(res.url);
  const [page] = await browser.pages();
  await page.goto(res.url);

  page.on('close', runDeoptigate);
  browser.on('disconnected', runDeoptigate);

  process.on('SIGINT', () => {
        runDeoptigate();
        process.exit();
  });
  
})();