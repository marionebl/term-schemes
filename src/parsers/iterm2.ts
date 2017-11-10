import is from "@marionebl/is";
import { entries, includes, values } from "lodash";
import { inspect, error } from "util";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const { parse } = require("plist");

enum Iterm2ColorName {
  Black = "Ansi 0 Color",
  Red = "Ansi 1 Color",
  Green = "Ansi 2 Color",
  Yellow = "Ansi 3 Color",
  Blue = "Ansi 4 Color",
  Magenta = "Ansi 5 Color",
  Cyan = "Ansi 6 Color",
  White = "Ansi 7 Color",
  LightBlack = "Ansi 8 Color",
  LightRed = "Ansi 9 Color",
  LightGreen = "Ansi 10 Color",
  LightYellow = "Ansi 11 Color",
  LightBlue = "Ansi 12 Color",
  LightMagenta = "Ansi 13 Color",
  LightCyan = "Ansi 14 Color",
  LightWhite = "Ansi 15 Color",
  Background = "Background Color",
  Bold = "Bold Color",
  Cursor = "Cursor Color",
  CursorText = "Cursor Text Color",
  Foreground = "Foreground Color"
}

interface Iterm2Color {
  "Blue Component": number;
  "Green Component": number;
  "Red Component": number;
}

interface Iterm2Data {
  "Ansi 0 Color": Iterm2Color;
  "Ansi 1 Color": Iterm2Color;
  "Ansi 2 Color": Iterm2Color;
  "Ansi 3 Color": Iterm2Color;
  "Ansi 4 Color": Iterm2Color;
  "Ansi 5 Color": Iterm2Color;
  "Ansi 6 Color": Iterm2Color;
  "Ansi 7 Color": Iterm2Color;
  "Ansi 8 Color": Iterm2Color;
  "Ansi 9 Color": Iterm2Color;
  "Ansi 10 Color": Iterm2Color;
  "Ansi 11 Color": Iterm2Color;
  "Ansi 12 Color": Iterm2Color;
  "Ansi 13 Color": Iterm2Color;
  "Ansi 14 Color": Iterm2Color;
  "Ansi 15 Color": Iterm2Color;
  "Background Color": Iterm2Color;
  "Bold Color": Iterm2Color;
  "Cursor Color": Iterm2Color;
  "Cursor Text Color": Iterm2Color;
  "Foreground Color": Iterm2Color;
}

const COLOR_KEYS = ["Red Component", "Green Component", "Blue Component"];
const COLOR_NAMES = values(Iterm2ColorName);

/* Convert a string to TermScheme */
export function iterm2(input: string): TermScheme {
  if (!is.string(input) || is.emptyOrWhitespace(input)) {
    throw new TypeError(`iterm2: input must be non-empty string`);
  }

  const data = parse(input);

  if (!isIterm2Data(data)) {
    const errs = getIterm2DataErrrors(data);
    throw new TypeError(
      `iterm2: input ${inspect(data)} is invalid: ${new AggregateError(errs)}`
    );
  }

  const get = getColor(data);

  return {
    0: get(Iterm2ColorName.Black),
    1: get(Iterm2ColorName.Red),
    2: get(Iterm2ColorName.Green),
    3: get(Iterm2ColorName.Yellow),
    4: get(Iterm2ColorName.Blue),
    5: get(Iterm2ColorName.Magenta),
    6: get(Iterm2ColorName.Cyan),
    7: get(Iterm2ColorName.White),
    8: get(Iterm2ColorName.LightBlack),
    9: get(Iterm2ColorName.LightRed),
    10: get(Iterm2ColorName.LightGreen),
    11: get(Iterm2ColorName.LightYellow),
    12: get(Iterm2ColorName.LightBlue),
    13: get(Iterm2ColorName.LightMagenta),
    14: get(Iterm2ColorName.LightCyan),
    15: get(Iterm2ColorName.LightWhite),
    background: get(Iterm2ColorName.Background),
    bold: get(Iterm2ColorName.Bold),
    cursor: get(Iterm2ColorName.Cursor),
    text: get(Iterm2ColorName.Foreground)
  };
}

/** Check if data is valid and complete iTerm2 colors profile  */
function isIterm2Data(data: any): data is Iterm2Data {
  if (!is.plainObject(data)) {
    return false;
  }

  const present = Object.keys(data);

  const missing = COLOR_NAMES.filter(
    (name: any) => typeof name === "string"
  ).some((name: string) => !includes(present, name));

  if (missing) {
    return false;
  }

  const malformed = values(data).some((color: any) => !isIterm2Color(color));

  if (malformed) {
    return false;
  }

  return true;
}

/** Check if data is valid iTerm2Color */
function isIterm2Color(data: any): data is Iterm2Color {
  if (!is.plainObject(data)) {
    return false;
  }

  const missing = COLOR_KEYS.some((key: string) => !(key in data));

  if (missing) {
    return false;
  }

  const malformed = values(data).some(color => !is.inRange(color, 1));

  if (malformed) {
    return false;
  }

  return true;
}

function getColor(data: Iterm2Data) {
  return function get(name: Iterm2ColorName): TermSchemeColor {
    const color = data[name];
    return [
      toColor(color["Red Component"]),
      toColor(color["Green Component"]),
      toColor(color["Blue Component"])
    ];
  };
}

function toColor(input: number): number {
  return Math.round(input * 255);
}

function getIterm2DataErrrors(data: any): TypeError[] {
  if (!is.plainObject(data)) {
    return [new TypeError(`expected type object, received ${is(data)}`)];
  }

  const errors: TypeError[] = [];

  const present = Object.keys(data);

  COLOR_NAMES.filter((name: string) => !includes(present, name)).forEach(
    (name: string) => errors.push(new TypeError(`Missing ${name}`))
  );

  const colorErrors = Object.keys(data)
    .filter((name: any) => typeof name === "string")
    .filter((name: string) => includes(COLOR_NAMES, name))
    .reduce((acc: TypeError[], colorName: string) => {
      const color = data[colorName];
      const errs = getIterm2ColorErrors(color, colorName);
      return [...acc, ...errs];
    }, []);

  return [...errors, ...colorErrors];
}

function getIterm2ColorErrors(data: any, id: string): TypeError[] {
  if (!is.plainObject(data)) {
    return [
      new TypeError(`expected type object, received ${is(data)} for ${id}`)
    ];
  }

  const errors: TypeError[] = [];

  const present = Object.keys(data);

  COLOR_KEYS.filter((name: string) => !includes(present, name)).forEach(
    (key: string) => errors.push(new TypeError(`Missing "${key}" in "${id}"`))
  );

  entries(data)
    .filter(([name]) => !includes(COLOR_NAMES, name))
    .forEach(([name, color]) => {
      if (!is.number(color)) {
        errors.push(
          new TypeError(
            `"${name}" in "${id}" must be number, received ${is(color)}`
          )
        );
      }

      if (!is.inRange(color as number, 1)) {
        errors.push(
          new TypeError(
            `"${name}" in "${id}" must range between 0 and 1 in ${name} in ${
              name
            }, was ${color}`
          )
        );
      }
    });

  return errors;
}
