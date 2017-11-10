const matchers = require('./matchers');
const termSchemes = require('.');

expect.extend(matchers);

test('exports iterm method', () => {
  expect(termSchemes).toHaveProperty('iterm2');
  expect(termSchemes.iterm2).isFunction();
});
