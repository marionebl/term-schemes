import { inspect } from "util";
import is from "@marionebl/is";
import { decode } from "ini";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const hexRgb = require("hex-rgb");

export type Parser = (raw: any) => TermScheme;
export type Normalizer = (raw: string) => [Error, null] | [null, RemminaScheme];

export interface ParserOptions {
  group: string | null;
  wrap: boolean;
}

export interface NormalizerOptions {
  group: string;
}

export interface RemminaScheme {
  color0: TermSchemeColor;
  color1: TermSchemeColor;
  color2: TermSchemeColor;
  color3: TermSchemeColor;
  color4: TermSchemeColor;
  color5: TermSchemeColor;
  color6: TermSchemeColor;
  color7: TermSchemeColor;
  color8: TermSchemeColor;
  color9: TermSchemeColor;
  color10: TermSchemeColor;
  color11: TermSchemeColor;
  color12: TermSchemeColor;
  color13: TermSchemeColor;
  color14: TermSchemeColor;
  color15: TermSchemeColor;
  background: TermSchemeColor;
  bold: TermSchemeColor;
  cursor: TermSchemeColor;
  foreground: TermSchemeColor;
}

const REMINNA_KEYS = [
  'background',
  'colorBD',
  'cursor',
  'foreground',
  'color0',
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'color6',
  'color7',
  'color8',
  'color9',
  'color10',
  'color11',
  'color12',
  'color14',
  'color15'
];

const EXACT_HEX_MATCH = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const HEX_MATCH = /= (#[A-Fa-f0-9]{6}|[A-Fa-f0-9]{6})/g;

export const remmina = createParser('remmina', {
  group: 'ssh_colors',
  wrap: true
});

export function createParser(name: string, opts: ParserOptions): Parser {
  const normalize = createNormalizer(name, {group: opts.group});

  return (raw: any): TermScheme => {
    if (!is.string(raw) || is.emptyOrWhitespace(raw)) {
      throw new TypeError(`${name}: input must be non-empty string`);
    }

    // Wrap hex colors in quotes
    const input = opts.wrap ? raw.replace(HEX_MATCH, '= "$1"') : raw;
    const data = decode(input);

    const [err, n] = normalize(data);

    if (err) {
      throw err;
    }

    return {
      0: n.color0,
      1: n.color1,
      2: n.color2,
      3: n.color3,
      4: n.color4,
      5: n.color5,
      6: n.color6,
      7: n.color7,
      8: n.color8,
      9: n.color9,
      10: n.color10,
      11: n.color11,
      12: n.color12,
      13: n.color13,
      14: n.color14,
      15: n.color15,
      bold: n.bold,
      cursor: n.cursor,
      text: n.foreground,
      background: n.background
    };
  };
}

function createNormalizer(name: string, opts: NormalizerOptions): Normalizer {
  return function normalize(raw: any): [Error, null] | [null, RemminaScheme] {
    if (is.empty(raw)) {
      throw new TypeError(`${name}: input must be non-empty colors`);
    }

    if (!(opts.group in raw)) {
      throw new TypeError(`${name}: expected ${opts.group} group in colorscheme`);
    }

    const data = raw[opts.group];

    if (is.empty(data)) {
      throw new TypeError(`${name}: input must be non-empty colors, ${opts.group} was empty`);
    }

    const errors: Error[] = [];

    REMINNA_KEYS
      .filter((key) => {
        if (!(key in data)) {
          errors.push(new TypeError(`${name}: missing "${key}"`));
          return false;
        }
        return true;
      })
      .filter((key) => {
        const val = data[key];

        if (!is.string(val)) {
          errors.push(new TypeError(`${name}: expected "${key}" to be string, received "${typeof val}"`));
          return false;
        }

        return true;
      })
      .filter((key) => {
        const val = data[key];

        if (!val.match(EXACT_HEX_MATCH)) {
          errors.push(new TypeError(`${name}: expected "${key}" to be hex color, received "${val}"`));
          return false;
        }

        return true;
      });

    if (errors.length > 0) {
      return [new AggregateError(errors), null];
    }

    return [null, {
      color0: toRgb(data.color0),
      color1: toRgb(data.color1),
      color2: toRgb(data.color2),
      color3: toRgb(data.color3),
      color4: toRgb(data.color4),
      color5: toRgb(data.color5),
      color6: toRgb(data.color6),
      color7: toRgb(data.color7),
      color8: toRgb(data.color8),
      color9: toRgb(data.color9),
      color10: toRgb(data.color10),
      color11: toRgb(data.color11),
      color12: toRgb(data.color12),
      color13: toRgb(data.color13),
      color14: toRgb(data.color14),
      color15: toRgb(data.color15),
      background: toRgb(data.background),
      bold: toRgb(data.colorBD),
      cursor: toRgb(data.cursor),
      foreground: toRgb(data.foreground)
    }];
  }
}

function toRgb(input: string): TermSchemeColor {
  return hexRgb(input);
}
