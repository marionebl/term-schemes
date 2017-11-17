const { termite } = require("./termite");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(termite).isFunction();
});

test("throws for empty input", () => {
  expect(() => termite()).toThrow(/termite: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => termite("")).toThrow(/termite: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => termite(" ")).toThrow(/termite: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("termite/empty");
  expect(() => termite(empty)).toThrow(/termite: input must be non-empty colors/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("termite/incomplete");
  expect(() => termite(incomplete)).toThrow(/termite: missing "background"/);
});

test("throws for malformed values", async () => {
  const incomplete = await fixture("termite/malformed-values");
  expect(() => termite(incomplete)).toThrow(/termite: expected "background" to be hex color, received "malformed-value"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("termite/Seti");
  expect(termite(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("termite/Atom");
  expect(termite(data)).toEqual(atom);
});
