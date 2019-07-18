const setup = require('./starter-kit/setup');
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  try {
    const result = await exports.run(browser);
    callback(null, result);
  } catch (e) {
    callback(e);
  }
};

exports.run = async (browser) => {
  // implement here
  // this is sample
  const page = await browser.newPage();
  console.log('STEP 3');
  await page.goto('https://www.google.com/maps',
   {waitUntil: ['domcontentloaded', 'networkidle0']}
  );
  console.log('STEP 4');
  console.log((await page.content()).slice(0, 500));
  console.log('STEP 5');
  // await page.waitForNavigation();
  // await page.click('input[name="btnK"]');
  // await page.waitForNavigation();
  //
  // avoid to timeout waitForNavigation() after click()
  // await Promise.all([
  //   // avoid to
  //   // 'Cannot find context with specified id undefined' for localStorage
  //   page.waitForNavigation(),
  //   page.click('input[name="btnK"]'),
  // ]);

  // take screenshot
  await page.screenshot({path: '/tmp/screenshot.png'});
  const screenshot = await new Promise((resolve, reject) => {
    fs.readFile('/tmp/screenshot.png', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
  await s3.putObject({
    Bucket: 'classicboy-lambda-test',
    Key: 'screenshot.png',
    Body: screenshot,
  }).promise();

  // cookie and localStorage
  await page.setCookie({name: 'name', value: 'cookieValue'});
  console.log(await page.cookies());
  console.log(await page.evaluate(() => {
    localStorage.setItem('name', 'localStorageValue');
    return localStorage.getItem('name');
  }));
  await page.close();
  console.log('STEP 10');
  return 'done';
};
