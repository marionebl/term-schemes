const { tilda } = require("./tilda");
const matchers = require("../matchers");
const { fixture } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(tilda).isFunction();
});

test("throws for empty input", () => {
  expect(() => tilda()).toThrow(/tilda: input must be non-empty string/);
});

test("throws for empty string", () => {
  expect(() => tilda("")).toThrow(/tilda: input must be non-empty string/);
});

test("throws for whitespace only input", () => {
  expect(() => tilda(" ")).toThrow(/tilda: input must be non-empty string/);
});

test("throws for empty input", async () => {
  const empty = await fixture("tilda/empty.config_0");
  expect(() => tilda(empty)).toThrow(/tilda: input must be non-empty config/);
});

test("throws for incomplete input", async () => {
  const empty = await fixture("tilda/incomplete.config_0");
  expect(() => tilda(empty)).toThrow(/tilda: missing back_green/);
});

test("throws for malformed value", async () => {
  const empty = await fixture("tilda/malformed-values.config_0");
  expect(() => tilda(empty)).toThrow(/"back_blue" must be castable to number, received "malformed"/);
});

test("throws for malformed palette", async () => {
  const empty = await fixture("tilda/malformed-palette.config_0");
  expect(() => tilda(empty)).toThrow(/Expected first char in palette to be {, received 0/);
});

test("throws for incomplete palette", async () => {
  const empty = await fixture("tilda/incomplete-palette.config_0");
  expect(() => tilda(empty)).toThrow(/Expected palette to be comma separated list of 48 numbers, received 47/);
});

test("throws for malformed palette", async () => {
  const empty = await fixture("tilda/malformed-palette-item.config_0");
  expect(() => tilda(empty)).toThrow(/tilda: palette item "0" must be castable to number, received "malformed"/);
});

test("returns expected result for Seti", async () => {
  const data = await fixture("tilda/Seti.config_0");
  expect(tilda(data)).toEqual({
    '0': [ 0, 0, 0 ],
    '1': [ 253, 95, 241 ],
    '2': [ 135, 195, 138 ],
    '3': [ 256, 215, 177 ],
    '4': [ 133, 190, 254 ],
    '5': [ 186, 182, 253 ],
    '6': [ 133, 190, 254 ],
    '7': [ 224, 224, 224 ],
    '8': [ 0, 0, 0 ],
    '9': [ 253, 95, 241 ],
    '10': [ 148, 250, 54 ],
    '11': [ 246, 256, 168 ],
    '12': [ 150, 203, 254 ],
    '13': [ 186, 182, 253 ],
    '14': [ 133, 190, 254 ],
    '15': [ 224, 224, 224 ],
    background: [ 22, 23, 25 ],
    bold: [ 197, 200, 198 ],
    cursor: [ 208, 208, 208 ],
    text: [ 197, 200, 198 ]
  });
});

test("returns expected result for Atom", async () => {
  const data = await fixture("tilda/Atom.config_0");
  expect(tilda(data)).toEqual({ '0': [ 50, 50, 50 ],
    '1': [ 194, 40, 50 ],
    '2': [ 142, 196, 61 ],
    '3': [ 224, 198, 79 ],
    '4': [ 67, 165, 213 ],
    '5': [ 139, 87, 181 ],
    '6': [ 142, 196, 61 ],
    '7': [ 238, 238, 238 ],
    '8': [ 50, 50, 50 ],
    '9': [ 194, 40, 50 ],
    '10': [ 142, 196, 61 ],
    '11': [ 224, 198, 79 ],
    '12': [ 67, 165, 213 ],
    '13': [ 139, 87, 181 ],
    '14': [ 142, 196, 61 ],
    '15': [ 256, 256, 256 ],
    background: [ 17, 18, 19 ],
    bold: [ 202, 206, 205 ],
    cursor: [ 227, 191, 33 ],
    text: [ 202, 206, 205 ]
  });
});
