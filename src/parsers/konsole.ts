import { inspect } from "util";
import is from "@marionebl/is";
import { decode } from "ini";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");

interface KonsoleScheme {
  Color0: TermSchemeColor;
  Color0Intense: TermSchemeColor;
  Color1: TermSchemeColor;
  Color1Intense: TermSchemeColor;
  Color2: TermSchemeColor;
  Color2Intense: TermSchemeColor;
  Color3: TermSchemeColor;
  Color3Intense: TermSchemeColor;
  Color4: TermSchemeColor;
  Color4Intense: TermSchemeColor;
  Color5: TermSchemeColor;
  Color5Intense: TermSchemeColor;
  Color6: TermSchemeColor;
  Color6Intense: TermSchemeColor;
  Color7: TermSchemeColor;
  Color7Intense: TermSchemeColor;
  Background: TermSchemeColor;
  Foreground: TermSchemeColor;
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
    1: n.Color1,
    0: n.Color0,
    2: n.Color2,
    3: n.Color3,
    4: n.Color4,
    5: n.Color5,
    6: n.Color6,
    7: n.Color7,
    8: n.Color0Intense,
    9: n.Color1Intense,
    10: n.Color2Intense,
    11: n.Color3Intense,
    12: n.Color4Intense,
    13: n.Color5Intense,
    14: n.Color6Intense,
    15: n.Color7Intense,
    bold: n.Foreground,
    cursor: n.Foreground,
    text: n.Foreground,
    background: n.Background
  };
}

function normalize(data: any): [Error, null] | [null, KonsoleScheme] {
  if (is.empty(data)) {
    throw new TypeError(`konsole: input must be non-empty colorscheme`);
  }

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

      if (!('Color' in val)) {
        errors.push(new TypeError(`konsole: missing "Color" in "${key}", received "${inspect(val)}"`));
        return false;
      }

      return true;
    })
    .filter((key) => {
      const val = data[key].Color;
      const fragments = val.split(',');

      if (fragments.length !== 3) {
        errors.push(new TypeError(`konsole: expected "${key}" to be comma-separated rgb, received "${val}"`));
        return false;
      }

      const nums = fragments.map((f: string) => Number(f));

      if (nums.length !== 3) {
        errors.push(new TypeError(`konsole: expected "${key}" to be comma-separated rgb, received "${val}"`));
        return false;
      }

      const invalid = nums.filter((n: number) => !is.inRange(n, 255));

      if (invalid.length > 0) {
        errors.push(new TypeError(`konsole: expected "${key}" to be comma-separated rgb, received "${val}"`));
        return false;
      }
    });

  if (errors.length > 0) {
    return [new AggregateError(errors), null];
  }

  return [null, {
    Color0: toRgb(data.Color0.Color),
    Color0Intense: toRgb(data.Color0Intense.Color),
    Color1: toRgb(data.Color1.Color),
    Color1Intense: toRgb(data.Color1Intense.Color),
    Color2: toRgb(data.Color2.Color),
    Color2Intense: toRgb(data.Color2Intense.Color),
    Color3: toRgb(data.Color3.Color),
    Color3Intense: toRgb(data.Color3Intense.Color),
    Color4: toRgb(data.Color4.Color),
    Color4Intense: toRgb(data.Color4Intense.Color),
    Color5: toRgb(data.Color5.Color),
    Color5Intense: toRgb(data.Color5Intense.Color),
    Color6: toRgb(data.Color6.Color),
    Color6Intense: toRgb(data.Color6Intense.Color),
    Color7: toRgb(data.Color7.Color),
    Color7Intense: toRgb(data.Color7Intense.Color),
    Background: toRgb(data.Background.Color),
    Foreground: toRgb(data.Foreground.Color)
  }];
}

function toRgb(input: string): TermSchemeColor {
  const f = input.split(',').map((i: string) => Number(i));
  return [f[0], f[1], f[2]];
}
