const { terminal } = require("./terminal");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

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

test("throws for incomplete input", async () => {
  const incomplete = await fixture("terminal/incomplete.terminal");
  expect(() => terminal(incomplete)).toThrow(/Missing ANSIBlackColor/);
});

test("throws for malformed input", async () => {
  const malformed = await fixture("terminal/malformed.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Parsing ANSIBlackColor failed/
  );
});

test("throws for input with malformed keys", async () => {
  const malformed = await fixture("terminal/malformed-keys.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Parsing ANSIBlackColor failed/
  );
});

test("throws for input with malformed values", async () => {
  const malformed = await fixture("terminal/malformed-values.terminal");
  expect(() => terminal(malformed)).toThrow(
    /Missing NSRGB in color ANSIBlackColor/
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
