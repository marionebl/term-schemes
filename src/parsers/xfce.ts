import is from "@marionebl/is";
import { decode } from "ini";
import { partition } from "lodash";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const hexRgb = require("hex-rgb");

interface XfceScheme {
  0: TermSchemeColor;
  1: TermSchemeColor;
  2: TermSchemeColor;
  3: TermSchemeColor;
  4: TermSchemeColor;
  5: TermSchemeColor;
  6: TermSchemeColor;
  7: TermSchemeColor;
  8: TermSchemeColor;
  9: TermSchemeColor;
  10: TermSchemeColor;
  11: TermSchemeColor;
  12: TermSchemeColor;
  13: TermSchemeColor;
  14: TermSchemeColor;
  15: TermSchemeColor;
  ColorBackground: TermSchemeColor;
  ColorForeground: TermSchemeColor;
  ColorCursor: TermSchemeColor;
}

const XCFE_KEYS = [
  'ColorForeground',
  'ColorBackground',
  'ColorCursor'
];

const EXACT_HEX_MATCH = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const HEX_MATCH = /=(?: ?)(#(:?.*))/g;

export function xfce(raw: any): TermScheme {
  if (!is.string(raw) || is.emptyOrWhitespace(raw)) {
    throw new TypeError(`xfce: input must be non-empty string`);
  }

  const input = raw.replace(HEX_MATCH, '="$1"');
  const data = decode(input);

  const [error, n] = normalize(data);

  if (error) {
    throw error;
  }

  return {
    background: n.ColorBackground,
    bold: n.ColorForeground,
    cursor: n.ColorCursor,
    text: n.ColorForeground,
    0: n[0],
    1: n[1],
    2: n[2],
    3: n[3],
    4: n[4],
    5: n[5],
    6: n[6],
    7: n[7],
    8: n[8],
    9: n[9],
    10: n[10],
    11: n[11],
    12: n[12],
    13: n[13],
    14: n[14],
    15: n[15]
  };
}

function normalize(raw: any): [Error, null] | [null, XfceScheme] {
  const data = raw.Scheme;

  if (is.empty(data)) {
    return [new TypeError(`xfce: input must be non-empty config`), null];
  }

  const errors = XCFE_KEYS
    .map(key => {
      if (!(key in data)) {
        return new TypeError(`xfce: missing ${key}`);
      }

      const val = data[key];

      if (!is.string(val)) {
        return new TypeError(`xfce: "${key}" must be string, received "${typeof val}"`);
      }

      if (!val.match(EXACT_HEX_MATCH)) {
        return new TypeError(`xfce: expected "${key}" to be hex color, received "${val}"`);
      }
    })
    .filter(Boolean);

  if (!('ColorPalette' in data)) {
    errors.push(new TypeError(`xfce: missing "ColorPalette"`));
  }

  const palette = (data.ColorPalette || '').split(';');

  if (palette.length !== 16) {
    errors.push(new TypeError(`xcfe: expected "ColorPalette" to be list of 16 hex colors separated by ";", received ${palette.length}`));
  }

  const items = palette
    .map((item: string, i: number) => {
      if (!item.match(EXACT_HEX_MATCH)) {
        return new TypeError(`xcfe: "ColorPalette" item "${i}" must be hex color, received "${item}"`);
      }
      return hexRgb(item);
    })

  const [err, colors] = partition(items, (i: any) => is.error(i));

  errors.push(...err);

  if (errors.length > 0) {
    return [new AggregateError(errors), null];
  }

  return [
    null,
    {
      0: colors[0],
      1: colors[1],
      2: colors[2],
      3: colors[3],
      4: colors[4],
      5: colors[5],
      6: colors[6],
      7: colors[7],
      8: colors[8],
      9: colors[9],
      10: colors[10],
      11: colors[11],
      12: colors[12],
      13: colors[13],
      14: colors[14],
      15: colors[15],
      ColorForeground: hexRgb(data.ColorForeground),
      ColorBackground: hexRgb(data.ColorBackground),
      ColorCursor: hexRgb(data.ColorCursor)
    }
  ];
}
