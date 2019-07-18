const setup = require('./starter-kit/setup');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  console.log('STEP 1');
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
  console.log('STEP 2');
  const page = await browser.newPage();
  console.log('STEP 3');
  await page.goto('https://www.google.co.jp',
   {waitUntil: ['domcontentloaded', 'networkidle0']}
  );
  console.log('STEP 4');
  console.log((await page.content()).slice(0, 500));
  console.log('STEP 5');
  await page.type('input[name="q"]', 'aaaaa');
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

/* screenshot
  await page.screenshot({path: '/tmp/screenshot.png'});
  const aws = require('aws-sdk');
  const s3 = new aws.S3({apiVersion: '2006-03-01'});
  const fs = require('fs');
  const screenshot = await new Promise((resolve, reject) => {
    fs.readFile('/tmp/screenshot.png', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
  await s3.putObject({
    Bucket: '<bucket name>',
    Key: 'screenshot.png',
    Body: screenshot,
  }).promise();
*/
  console.log('STEP 6');
  // cookie and localStorage
  await page.setCookie({name: 'name', value: 'cookieValue'});
  console.log('STEP 7');
  console.log(await page.cookies());
  console.log('STEP 8');
  console.log(await page.evaluate(() => {
    localStorage.setItem('name', 'localStorageValue');
    return localStorage.getItem('name');
  }));
  console.log('STEP 9');
  await page.close();
  console.log('STEP 10');
  return 'done';
};
