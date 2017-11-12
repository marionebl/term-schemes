const { terminal } = require("./terminal");
const matchers = require("../matchers");
const { fixture } = require("../helpers");

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
  const seti = await fixture("terminal/Seti.terminal");
  expect(terminal(seti)).toEqual({
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
  const seti = await fixture("terminal/Atom.terminal");
  expect(terminal(seti)).toEqual({
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
