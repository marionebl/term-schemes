import is from "@marionebl/is";
import { decode } from "ini";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");

interface TildaScheme {
  back: TermSchemeColor;
  text: TermSchemeColor;
  cursor: TermSchemeColor;
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
}

const TILDA_KEYS = [
  'back_red',
  'back_green',
  'back_blue',
  'cursor_red',
  'cursor_green',
  'cursor_blue',
  'text_red',
  'text_green',
  'text_blue'
];

export function tilda(raw: any): TermScheme {
  if (!is.string(raw) || is.emptyOrWhitespace(raw)) {
    throw new TypeError(`tilda: input must be non-empty string`);
  }

  const data = decode(raw);

  const [error, n] = normalize(data);

  if (error) {
    throw error;
  }

  return {
    background: n.back,
    bold: n.text,
    cursor: n.cursor,
    text: n.text,
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

function normalize(data: any): [Error, null] | [null, TildaScheme] {
  if (is.empty(data)) {
    return [new TypeError(`tilda: input must be non-empty config`), null];
  }

  const errors: Error[] = [];

  const faulty = TILDA_KEYS
    .map(key => {
      if (!(key in data)) {
        return new TypeError(`tilda: missing ${key}`);
      }

      const val = data[key];

      if (!is.string(val)) {
        return new TypeError(`tilda: "${key}" must be string, received "${typeof val}"`);
      }

      const num = Number(val);

      if (is.nan(num)) {
        return new TypeError(`tilda: "${key}" must be castable to number, received "${val}"`);
      }
    })
    .filter(Boolean);

  if (!('palette' in data)) {
    errors.push(new TypeError(`tilda: missing palette`));
  }

  errors.push(...faulty);

  const {palette: rp} = data;
  const leading = rp.charAt(0) === '{';
  const trailing = rp.charAt(rp.length - 1) === '}';
  const valid = leading && trailing;

  if (!leading) {
    errors.push(new TypeError(`Expected first char in palette to be {, received ${rp.charAt(0)}`));
  }

  if (!trailing) {
    errors.push(new TypeError(`Expected first char in palette to be }, received ${rp.charAt(rp.length - 1)}`));
  }

  const palette = data.palette
    .replace(/^{/, '')
    .replace(/}$/, '')
    .split(',')
    .map((item: string) => item.trim());

  if (palette.length !== 48) {
    errors.push(new TypeError(`Expected palette to be comma separated list of 48 numbers, received ${palette.length}`));
  }

  const paletteErrors = palette
    .map((c: number, i: number) => {
      const num = Number(c);

      if (is.nan(num)) {
        return new TypeError(`tilda: palette item "${i}" must be castable to number, received "${c}"`);
      }
    })
    .filter(Boolean);

  const colors = palette.reduce((acc: TermSchemeColor[], component: string, i: number) => {
    const j = Math.floor(i / 3);
    const k = Math.floor(i % 3);
    const ready = Array.isArray(acc[j]);

    const color: any = ready ? acc[j] : [];
    color[k] = comp(component);

    if (!ready) {
      acc.push(color);
    }

    return acc;
  }, []);

  errors.push(...paletteErrors);

  if (errors.length > 0) {
    return [new AggregateError(errors), null];
  }

  const back: TermSchemeColor = [comp(data.back_red), comp(data.back_green), comp(data.back_blue)];
  const text: TermSchemeColor = [comp(data.text_red), comp(data.text_green), comp(data.text_blue)];
  const cursor: TermSchemeColor = [comp(data.cursor_red), comp(data.cursor_green), comp(data.cursor_blue)];

  return [
    null,
    {
      back: back,
      cursor: cursor,
      text: text,
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
      15: colors[15]
    }
  ];
}

function comp(input: string): number {
  return Math.round((Number(input) / 0xFFFF) * 255);
}
