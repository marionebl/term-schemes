const { xterm } = require("./xterm");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(xterm).isFunction();
});

test("throws for empty input", () => {
  expect(() => xterm()).toThrow(/xterm: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => xterm("")).toThrow(/xterm: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => xterm(" ")).toThrow(/xterm: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("xterm/empty.xrdb");
  expect(() => xterm(empty)).toThrow(/xterm: input must be non-empty config/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("xterm/incomplete.xrdb");
  expect(() => xterm(incomplete)).toThrow(/xterm: missing "Ansi_0_Color"/);
});

test("throws for malformed values", async () => {
  const incomplete = await fixture("xterm/malformed-values.xrdb");
  expect(() => xterm(incomplete)).toThrow(/xterm: expected "Ansi_0_Color" to be hex color, received "this_is_malformed"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("xterm/Seti.xrdb");
  expect(xterm(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("xterm/Atom.xrdb");
  expect(xterm(data)).toEqual(atom);
});
