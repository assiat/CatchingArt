'use strict';

describe('Guides E2E Tests:', function () {
  describe('Test Guides page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/guides');
      expect(element.all(by.repeater('guide in guides')).count()).toEqual(0);
    });
  });
});
