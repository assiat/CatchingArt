'use strict';

describe('Trophies E2E Tests:', function () {
  describe('Test Trophies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trophies');
      expect(element.all(by.repeater('trophy in trophies')).count()).toEqual(0);
    });
  });
});
