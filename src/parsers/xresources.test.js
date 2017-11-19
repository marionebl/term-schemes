const { xresources } = require("./xresources");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(xresources).isFunction();
});

test("throws for empty input", () => {
  expect(() => xresources()).toThrow(/xresources: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => xresources("")).toThrow(/xresources: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => xresources(" ")).toThrow(/xresources: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("xresources/empty");
  expect(() => xresources(empty)).toThrow(/xresources: input must be non-empty config/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("xresources/incomplete");
  expect(() => xresources(incomplete)).toThrow(/xresources: missing "foreground"/);
});

test.only("throws for malformed values", async () => {
  const incomplete = await fixture("xresources/malformed-values");
  expect(() => xresources(incomplete)).toThrow(/xresources: expected "foreground" to be hex color, received "malformed_value"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("xresources/Seti");
  expect(xresources(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("xresources/Atom");
  expect(xresources(data)).toEqual(atom);
});
