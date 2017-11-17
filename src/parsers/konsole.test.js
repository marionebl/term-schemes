const { konsole } = require("./konsole");
const matchers = require("../matchers");
const { atom, fixture, seti } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(konsole).isFunction();
});

test("throws for empty input", () => {
  expect(() => konsole()).toThrow(/konsole: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => konsole("")).toThrow(/konsole: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => konsole(" ")).toThrow(/konsole: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("konsole/empty.colorscheme");
  expect(() => konsole(empty)).toThrow(/konsole: input must be non-empty colorscheme/);
});

test("throws for incomplete input", async () => {
  const incomplete = await fixture("konsole/incomplete.colorscheme");
  expect(() => konsole(incomplete)).toThrow(/konsole: missing "Color0"/);
});

test("throws for malformed keys", async () => {
  const incomplete = await fixture("konsole/malformed-keys.colorscheme");
  expect(() => konsole(incomplete)).toThrow(/konsole: missing "Color" in "Background"/);
});

test("throws for malformed values", async () => {
  const incomplete = await fixture("konsole/malformed-values.colorscheme");
  expect(() => konsole(incomplete)).toThrow(/konsole: expected "Background" to be comma-separated rgb, received "InvalidValue"/);
});

test("throws for malformed range", async () => {
  const incomplete = await fixture("konsole/malformed-range.colorscheme");
  expect(() => konsole(incomplete)).toThrow(/konsole: expected "Background" to be comma-separated rgb, received "256,18,19"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("konsole/Seti.colorscheme");
  expect(konsole(data)).toEqual({
    0: [50, 50, 50],
    1: [194, 40, 50],
    2: [142, 196, 61],
    3: [224, 198, 79],
    4: [67, 165, 213],
    5: [139, 87, 181],
    6: [142, 196, 61],
    7: [238, 238, 238],
    8: [50, 50, 50],
    9: [194, 40, 50],
    10: [142, 196, 61],
    11: [224, 198, 79],
    12: [67, 165, 213],
    13: [139, 87, 181],
    14: [142, 196, 61],
    15: [255, 255, 255],
    background: [17, 18, 19],
    bold: [202, 206, 205],
    cursor: [202, 206, 205],
    text: [202, 206, 205]
  });
});

test("returns expected result for Atom", async () => {
  const data = await fixture("konsole/Atom.colorscheme");
  expect(konsole(data)).toEqual({
    0: [0, 0, 0],
    1: [253, 95, 241],
    2: [135, 195, 138],
    3: [255, 215, 177],
    4: [133, 190, 253],
    5: [185, 182, 252],
    6: [133, 190, 253],
    7: [224, 224, 224],
    8: [0, 0, 0],
    9: [253, 95, 241],
    10: [148, 250, 54],
    11: [245, 255, 168],
    12: [150, 203, 254],
    13: [185, 182, 252],
    14: [133, 190, 253],
    15: [224, 224, 224],
    background: [22, 23, 25],
    bold: [197, 200, 198],
    cursor: [197, 200, 198],
    text: [197, 200, 198]
  });
});
