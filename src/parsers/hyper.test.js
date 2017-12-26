const { hyper } = require("./hyper");
const matchers = require("../matchers");
const { atom, fixture, resolveFixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(hyper).isFunction();
});

test("throws for empty input", () => {
  expect(() => hyper(undefined, {filename: 'placeholder'})).toThrow(/hyper: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => hyper("", {filename: 'placeholder'})).toThrow(/hyper: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => hyper(" ", {filename: 'placeholder'})).toThrow(/hyper: input must be non-empty string/);
});

test("throws for empty config", async () => {
  const empty = await fixture("hyper/empty.js");
  expect(() => hyper(empty, {filename: 'placeholder'})).toThrow(/expected non-empty object, received {}/);
});

test("throws for missing top level keys", async () => {
  const empty = await fixture("hyper/missing.js");
  expect(() => hyper(empty, {filename: 'placeholder'})).toThrow(/missing "config.cursorColor"/);
});

test("throws for faulty extra color", async () => {
  const empty = await fixture("hyper/faulty.js");
  expect(() => hyper(empty, {filename: 'placeholder'})).toThrow(/"config.cursorColor" must be valid color, received "foo"/);
});

test("throws for missing color", async () => {
  const empty = await fixture("hyper/missing-color.js");
  expect(() => hyper(empty, {filename: 'placeholder'})).toThrow(/missing "config.colors.black"/);
});

test("throws for faulty color", async () => {
  const empty = await fixture("hyper/faulty-color.js");
  expect(() => hyper(empty, {filename: 'placeholder'})).toThrow(/"config.colors.black" must be valid color/);
});

test("works for valid input", async () => {
  const seti = await fixture("hyper/seti.js");
  expect(() => hyper(seti, {filename: 'placeholder'})).not.toThrow();
});

test("returns expected result for Atom", async () => {
  const data = await fixture("hyper/atom.js");
  expect(hyper(data, {filename: 'placeholder'})).toEqual(atom);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("hyper/seti.js");
  expect(hyper(data, {filename: 'placeholder'})).toEqual(seti);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("hyper/legacy.js");
  expect(hyper(data, {filename: 'placeholder'})).toEqual(seti);
});

test("works with require", async () => {
  const data = await fixture("hyper/external.js");
  const filename = await resolveFixture("hyper/external.js");
  expect(hyper(data, {filename})).toEqual(atom);
});
