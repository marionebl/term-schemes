const matchers = require('./matchers');
const termSchemes = require('.');

expect.extend(matchers);

test('exports iterm method', () => {
  expect(termSchemes).toHaveProperty('iterm2');
  expect(termSchemes.iterm2).isFunction();
});

test('exports terminal method', () => {
  expect(termSchemes).toHaveProperty('terminal');
  expect(termSchemes.terminal).isFunction();
});

test('exports terminator method', () => {
  expect(termSchemes).toHaveProperty('terminator');
  expect(termSchemes.terminator).isFunction();
});
