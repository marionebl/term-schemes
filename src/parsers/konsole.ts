import is from "@marionebl/is";
import { decode } from "ini";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");

interface KonsoleScheme {
  Color0: string;
  Color0Intense: string;
  Color1: string;
  Color1Intense: string;
  Color2: string;
  Color2Intense: string;
  Color3: string;
  Color3Intense: string;
  Color4: string;
  Color4Intense: string;
  Color5: string;
  Color5Intense: string;
  Color6: string;
  Color6Intense: string;
  Color7: string;
  Color7Intense: string;
  Background: string;
  Foreground: string;
}

const KONSOLE_KEYS = [
  'Color0',
  'Color0Intense',
  'Color1',
  'Color1Intense',
  'Color2',
  'Color3Intense',
  'Color4',
  'Color4Intense',
  'Color5',
  'Color5Intense',
  'Color6',
  'Color6Intense',
  'Color7',
  'Color7Intense',
  'Background',
  'Foreground'
];

export function konsole(input: any): TermScheme {
  if (!is.string(input) || is.emptyOrWhitespace(input)) {
    throw new TypeError(`konsole: input must be non-empty string`);
  }

  const data = decode(input);
  const [err, n] = normalize(data);

  if (err) {
    throw err;
  }

  return {
    1: toRgb(n.Color1),
    0: toRgb(n.Color0),
    2: toRgb(n.Color2),
    3: toRgb(n.Color3),
    4: toRgb(n.Color4),
    5: toRgb(n.Color5),
    6: toRgb(n.Color6),
    7: toRgb(n.Color7),
    8: toRgb(n.Color0Intense),
    9: toRgb(n.Color1Intense),
    10: toRgb(n.Color2Intense),
    11: toRgb(n.Color3Intense),
    12: toRgb(n.Color4Intense),
    13: toRgb(n.Color5Intense),
    14: toRgb(n.Color6Intense),
    15: toRgb(n.Color7Intense),
    bold: toRgb(n.Foreground),
    cursor: toRgb(n.Foreground),
    text: toRgb(n.Foreground),
    background: toRgb(n.Background)
  };
}

function normalize(data: any): [Error | null, KonsoleScheme] {
  const errors: Error[] = [];

  KONSOLE_KEYS
    .filter((key) => {
      if (!(key in data)) {
        errors.push(new TypeError(`konsole: missing "${key}"`));
        return false;
      }
      return true;
    })
    .filter((key) => {
      const val = data[key];

      if (!is.plainObject(val)) {
        errors.push(new TypeError(`konsole: expected "${key}" to be object, received "${typeof val}"`));
        return false;
      }

      if (!(key in data)) {
        errors.push(new TypeError(`konsole: missing "Color" in "${key}", received "${val}"`));
      }

      return true;
    });

  return [null, {
    Color0: data.Color0.Color,
    Color0Intense: data.Color0Intense.Color,
    Color1: data.Color1.Color,
    Color1Intense: data.Color1Intense.Color,
    Color2: data.Color2.Color,
    Color2Intense: data.Color2Intense.Color,
    Color3: data.Color3.Color,
    Color3Intense: data.Color3Intense.Color,
    Color4: data.Color4.Color,
    Color4Intense: data.Color4Intense.Color,
    Color5: data.Color5.Color,
    Color5Intense: data.Color5Intense.Color,
    Color6: data.Color6.Color,
    Color6Intense: data.Color6Intense.Color,
    Color7: data.Color7.Color,
    Color7Intense: data.Color7Intense.Color,
    Background: data.Background.Color,
    Foreground: data.Foreground.Color
  }];
}

function toRgb(input: string): TermSchemeColor {
  const f = input.split(',').map((i: string) => Number(i));
  return [f[0], f[1], f[2]];
}
