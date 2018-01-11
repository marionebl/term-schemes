const { terminal } = require("./terminal");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");
const { terminal: {colors} } = require("terminal-default-colors");

expect.extend(matchers);

test("exports a function", () => {
  expect(terminal).isFunction();
});

test("throws for empty input", () => {
  expect(() => terminal()).toThrow(/terminal: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => terminal("")).toThrow(/terminal: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => terminal(" ")).toThrow(/terminal: input must be non-empty string/);
});

test("throws for empty plist", async () => {
  const empty = await fixture("terminal/empty.terminal");
  expect(() => terminal(empty)).toThrow(/terminal: input must be non-empty p-list/);
});

test("works for valid input", async () => {
  const oneDark = await fixture("terminal/Seti.terminal");
  expect(() => terminal(oneDark)).not.toThrow();
});

test("works for all known colorspaces", async () => {
  const colorspaces = await fixture("terminal/colorspaces.terminal");
  expect(() => terminal(colorspaces)).not.toThrow();
});

test("throws for malformed input", async () => {
  const malformed = await fixture("terminal/malformed.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Parsing black failed/
  );
});

test("throws for input with malformed keys", async () => {
  const malformed = await fixture("terminal/malformed-keys.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Parsing black failed/
  );
});

test("throws for input with malformed values", async () => {
  const malformed = await fixture("terminal/malformed-values.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Unknown NSColorSpace undefined in color black/
  );
});

test("returns expected result for Seti", async () => {
  const data = await fixture("terminal/Seti.terminal");
  expect(terminal(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("terminal/Atom.terminal");
  expect(terminal(data)).toEqual(atom);
});

test("returns expected result for incomplete input", async () => {
  const incomplete = await fixture("terminal/incomplete.terminal");
  const actual = terminal(incomplete);

  expect(actual[0]).toEqual(colors[0].rgb);
  expect(actual[1]).toEqual(colors[1].rgb);
  expect(actual[2]).toEqual(colors[2].rgb);
  expect(actual[3]).toEqual(colors[3].rgb);
  expect(actual[4]).toEqual(colors[4].rgb);
  expect(actual[5]).toEqual(colors[5].rgb);
  expect(actual[6]).toEqual(colors[6].rgb);
  expect(actual[7]).toEqual(colors[7].rgb);
  expect(actual[8]).toEqual(colors[8].rgb);
  expect(actual[9]).toEqual(colors[9].rgb);
  expect(actual[10]).toEqual(colors[10].rgb);
});
