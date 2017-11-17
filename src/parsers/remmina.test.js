const { remmina } = require("./remmina");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(remmina).isFunction();
});

test("throws for empty input", () => {
  expect(() => remmina()).toThrow(/remmina: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => remmina("")).toThrow(/remmina: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => remmina(" ")).toThrow(/remmina: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("remmina/empty.colors");
  expect(() => remmina(empty)).toThrow(/remmina: input must be non-empty colors/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("remmina/incomplete.colors");
  expect(() => remmina(incomplete)).toThrow(/remmina: missing "background"/);
});

test("throws for malformed values", async () => {
  const incomplete = await fixture("remmina/malformed-values.colors");
  expect(() => remmina(incomplete)).toThrow(/remmina: expected "background" to be hex color, received "malformed-value"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("remmina/Seti.colors");
  expect(remmina(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("remmina/Atom.colors");
  expect(remmina(data)).toEqual(atom);
});
