const { xfce } = require("./xfce");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(xfce).isFunction();
});

test("throws for empty input", () => {
  expect(() => xfce()).toThrow(/xfce: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => xfce("")).toThrow(/xfce: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => xfce(" ")).toThrow(/xfce: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("xfce/empty.theme");
  expect(() => xfce(empty)).toThrow(/xfce: input must be non-empty config/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("xfce/incomplete.theme");
  expect(() => xfce(incomplete)).toThrow(/xfce: missing ColorBackground/);
});

test("throws for malformed input values", async () => {
  const m = await fixture("xfce/malformed-values.theme");
  expect(() => xfce(m)).toThrow(/xfce: expected "ColorForeground" to be hex color, received "malformed"/);
});

test("throws for incomplete palette", async () => {
  const m = await fixture("xfce/incomplete-palette.theme");
  expect(() => xfce(m)).toThrow(/xcfe: expected "ColorPalette" to be list of 16 hex colors separated by ";", received 15/);
});

test("throws for malformed palette", async () => {
  const m = await fixture("xfce/malformed-palette.theme");
  expect(() => xfce(m)).toThrow(/xcfe: "ColorPalette" item "0" must be hex color, received "#323232:#323232"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("xfce/Seti.theme");
  expect(xfce(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("xfce/Atom.theme");
  expect(xfce(data)).toEqual(atom);
});
