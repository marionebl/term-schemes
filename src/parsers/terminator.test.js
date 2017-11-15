const { terminator } = require("./terminator");
const matchers = require("../matchers");
const { fixture } = require("../helpers");

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

test.only("throws for input with malformed palette item", async () => {
  const empty = await fixture("terminator/malformed-palette-item.config");
  expect(() => terminator(empty)).toThrow(/terminator: "palette" must be list of 15 hex colors delimited by ":"/);
});

test("returns expected result for Seti", async () => {
  const seti = await fixture("terminator/Seti.config");
  expect(terminator(seti)).toEqual({
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
    cursor: [227, 191, 33],
    text: [202, 206, 205]
  });
});

test("returns expected result for Atom", async () => {
  const seti = await fixture("terminator/Atom.config");
  expect(terminator(seti)).toEqual({
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
    cursor: [208, 208, 208],
    text: [197, 200, 198]
  });
});
