const { terminator } = require("./terminator");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(terminator).isFunction();
});

test("throws for empty input", () => {
  expect(() => terminator()).toThrow(/terminator: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => terminator("")).toThrow(/terminator: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => terminator(" ")).toThrow(/terminator: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("terminator/empty.config");
  expect(() => terminator(empty)).toThrow(/terminator: config must be non-empty/);
});

test("throws for incomplete input", async () => {
  const empty = await fixture("terminator/incomplete.config");
  expect(() => terminator(empty)).toThrow(/terminator: "palette" missing from config/);
});

test("throws for input with malformed values", async () => {
  const empty = await fixture("terminator/malformed-values.config");
  expect(() => terminator(empty)).toThrow(/terminator: "background_color" must be hex color, received "#invalid-value"/);
});

test("throws for input with malformed palette", async () => {
  const empty = await fixture("terminator/malformed-palette.config");
  expect(() => terminator(empty)).toThrow(/terminator: "palette" must be list of 15 hex colors delimited by ":", received "malformed-palette"/);
});

test("throws for input with incomplete palette", async () => {
  const empty = await fixture("terminator/incomplete-palette.config");
  expect(() => terminator(empty)).toThrow(/terminator: "palette" must be list of 15 hex colors delimited by ":"/);
});

test("throws for input with malformed palette item", async () => {
  const empty = await fixture("terminator/malformed-palette-item.config");
  expect(() => terminator(empty)).toThrow(/terminator: "palette" must be list of 15 hex colors delimited by ":"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("terminator/Seti.config");
  expect(terminator(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("terminator/Atom.config");
  expect(terminator(data)).toEqual(atom);
});
