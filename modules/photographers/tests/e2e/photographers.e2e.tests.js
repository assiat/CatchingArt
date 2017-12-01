'use strict';

describe('Photographers E2E Tests:', function () {
  describe('Test Photographers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/photographers');
      expect(element.all(by.repeater('photographer in photographers')).count()).toEqual(0);
    });
  });
});
