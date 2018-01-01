const { iterm2 } = require("./iterm2");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(iterm2).isFunction();
});

test("throws for empty input", () => {
  expect(() => iterm2()).toThrow(/iterm2: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => iterm2("")).toThrow(/iterm2: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => iterm2(" ")).toThrow(/iterm2: input must be non-empty string/);
});

test("throws for empty plist", async () => {
  const empty = await fixture("iterm2/empty.itermcolors");
  expect(() => iterm2(empty)).toThrow(/iterm2: input must be non-empty plist, received \[\]/);
});

test("throws for incomplete input", async () => {
  const empty = await fixture("iterm2/incomplete.itermcolors");
  expect(() => iterm2(empty)).toThrow(/Missing Ansi 0 Color/);
});

test("throws for input with malformed keys", async () => {
  const malformed = await fixture("iterm2/malformed-keys.itermcolors");
  expect(() => iterm2(malformed)).toThrow(
    /Missing "Blue Component" in "Ansi 0 Color"/
  );
});

test("throws for input with malformed values", async () => {
  const malformed = await fixture("iterm2/malformed-values.itermcolors");
  expect(() => iterm2(malformed)).toThrow(
    /"Blue Component" in "Ansi 0 Color" must be number, received string/
  );
});

test("throws for input with out of range values", async () => {
  const malformed = await fixture("iterm2/malformed-range.itermcolors");
  expect(() => iterm2(malformed)).toThrow(
    /"Blue Component" in "Ansi 0 Color" must range between 0 and 1 in Blue Component in Blue Component, was 2/
  );
});

test("works for valid input", async () => {
  const seti = await fixture("iterm2/Seti.itermcolors");
  expect(() => iterm2(seti)).not.toThrow();
});

test("returns expected result for Seti", async () => {
  const data = await fixture("iterm2/Seti.itermcolors");
  expect(iterm2(data)).toEqual(seti);
});

test("returns expected result for Atom", async () => {
  const data = await fixture("iterm2/Atom.itermcolors");
  expect(iterm2(data)).toEqual(atom);
});

test("returns expected result for serialized Seti", async () => {
  const data = await fixture("iterm2/serialized.itermcolors");
  expect(iterm2(data)).toEqual({
    0: [65, 65, 65],
    1: [207, 61, 65],
    2: [158, 203, 77],
    3: [231, 206, 97],
    4: [81, 180, 221],
    5: [158, 112, 194],
    6: [158, 203, 77],
    7: [241, 241, 241],
    8: [65, 65, 65],
    9: [207, 61, 65],
    10: [158, 203, 77],
    11: [231, 206, 97],
    12: [81, 180, 221],
    13: [158, 112, 194],
    14: [158, 203, 77],
    15: [255, 255, 255],
    background: [21, 23, 24],
    bold: [212, 215, 214],
    cursor: [233, 200, 42],
    text: [212, 215, 214]
  });
});
