const matchers = require('./matchers');
const termSchemes = require('.');

expect.extend(matchers);

test('exports iterm2 method', () => {
  expect(termSchemes).toHaveProperty('iterm2');
  expect(termSchemes.iterm2).isFunction();
});

test('exports konsole method', () => {
  expect(termSchemes).toHaveProperty('konsole');
  expect(termSchemes.konsole).isFunction();
});

test('exports remmina method', () => {
  expect(termSchemes).toHaveProperty('remmina');
  expect(termSchemes.remmina).isFunction();
});


test('exports terminal method', () => {
  expect(termSchemes).toHaveProperty('terminal');
  expect(termSchemes.terminal).isFunction();
});

test('exports terminator method', () => {
  expect(termSchemes).toHaveProperty('terminator');
  expect(termSchemes.terminator).isFunction();
});

test('exports termite method', () => {
  expect(termSchemes).toHaveProperty('termite');
  expect(termSchemes.termite).isFunction();
});

test('exports tilda method', () => {
  expect(termSchemes).toHaveProperty('tilda');
  expect(termSchemes.tilda).isFunction();
});

test('exports xfce method', () => {
  expect(termSchemes).toHaveProperty('xfce');
  expect(termSchemes.xfce).isFunction();
});

test('exports xresources method', () => {
  expect(termSchemes).toHaveProperty('xresources');
  expect(termSchemes.xresources).isFunction();
});

test('exports xterm method', () => {
  expect(termSchemes).toHaveProperty('xterm');
  expect(termSchemes.xterm).isFunction();
});
