const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.target.com/store-locator/find-stores';

async function getStores() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('#storeLocatorLoadMore');
  
  let stores = [];
  while (true) {
    const storeElements = await page.$$('.styles__StoreWrapper-sc-1h5mbdu-0');
    for (const storeElement of storeElements) {
      const address = await storeElement.$eval('.styles__AddressContainer-sc-1h5mbdu-2', el => el.textContent.trim());
      const url = await storeElement.$eval('a', el => el.href);
      const lat = await storeElement.$eval('meta[itemprop="latitude"]', el => el.content);
      const lon = await storeElement.$eval('meta[itemprop="longitude"]', el => el.content);
      stores.push({ address, url, lat, lon });
    }

    const loadMoreButton = await page.$('#storeLocatorLoadMore');
    if (!loadMoreButton) {
      break;
    }

    await loadMoreButton.click();
    await page.waitForTimeout(1000);
  }

  await browser.close();
  return stores;
}

async function saveStoresToFile(stores) {
  const json = JSON.stringify(stores, null, 2);
  await fs.promises.writeFile('target-stores.json', json);
}

async function main() {
  const stores = await getStores();
  await saveStoresToFile(stores);
  console.log(`Saved ${stores.length} stores to target-stores.json`);
}

main().catch(console.error);

