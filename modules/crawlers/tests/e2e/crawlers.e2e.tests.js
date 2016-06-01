'use strict';

describe('Crawlers E2E Tests:', function () {
  describe('Test crawlers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crawlers');
      expect(element.all(by.repeater('crawler in crawlers')).count()).toEqual(0);
    });
  });
});
