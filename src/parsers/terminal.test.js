const { terminal } = require("./terminal");
const matchers = require("../matchers");
const { fixture } = require("../helpers");

expect.extend(matchers);

test("exports a function", () => {
  expect(terminal).isFunction();
});

test("throws for empty input", () => {
  expect(() => terminal()).toThrow();
});

test("throws for empty string", () => {
  expect(() => terminal("")).toThrow();
});

test("throws for whitespace only input", () => {
  expect(() => terminal(" ")).toThrow();
});

test("works for valid input", async () => {
  const oneDark = await fixture("terminal/Seti.terminal");
  expect(() => terminal(oneDark)).not.toThrow();
});
