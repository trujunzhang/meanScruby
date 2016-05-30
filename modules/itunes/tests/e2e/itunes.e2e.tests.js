'use strict';

describe('Articles E2E Tests:', function () {
  describe('Test itunes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/itunes');
      expect(element.all(by.repeater('itune in itunes')).count()).toEqual(0);
    });
  });
});
