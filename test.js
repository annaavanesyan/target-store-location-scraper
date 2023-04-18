const assert = require('assert');
const fs = require('fs');

describe('Target store locator', function () {
  it('should download the list of all stores', async function () {
    // Load the list of stores from the JSON file
    const json = await fs.promises.readFile('target-stores.json', 'utf8');
    const stores = JSON.parse(json);

    // Check that the list has at least 10,000 stores
    assert.ok(stores.length >= 10000, `Expected at least 10,000 stores, but got ${stores.length}`);

    // Check that each store has an address, URL, latitude, and longitude
    for (const store of stores) {
      assert.ok(store.address, `Store ${store.url} is missing an address`);
      assert.ok(store.url, `Store ${store.address} is missing a URL`);
      assert.ok(store.lat, `Store ${store.address} is missing a latitude`);
      assert.ok(store.lon, `Store ${store.address} is missing a longitude`);
    }
  });
});

