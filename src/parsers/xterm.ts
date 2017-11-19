import is from "@marionebl/is";
import { decode } from "ini";
import { partition } from "lodash";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const hexRgb = require("hex-rgb");

interface XfceScheme {
  Ansi_0_Color: TermSchemeColor;
  Ansi_1_Color: TermSchemeColor;
  Ansi_2_Color: TermSchemeColor;
  Ansi_3_Color: TermSchemeColor;
  Ansi_4_Color: TermSchemeColor;
  Ansi_5_Color: TermSchemeColor;
  Ansi_6_Color: TermSchemeColor;
  Ansi_7_Color: TermSchemeColor;
  Ansi_8_Color: TermSchemeColor;
  Ansi_9_Color: TermSchemeColor;
  Ansi_10_Color: TermSchemeColor;
  Ansi_11_Color: TermSchemeColor;
  Ansi_12_Color: TermSchemeColor;
  Ansi_13_Color: TermSchemeColor;
  Ansi_14_Color: TermSchemeColor;
  Ansi_15_Color: TermSchemeColor;
  Background_Color: TermSchemeColor;
  Bold_Color: TermSchemeColor;
  Cursor_Color: TermSchemeColor;
  Foreground_Color: TermSchemeColor;
}

const XTERM_KEYS = [
  "Ansi_0_Color",
  "Ansi_1_Color",
  "Ansi_2_Color",
  "Ansi_3_Color",
  "Ansi_4_Color",
  "Ansi_5_Color",
  "Ansi_6_Color",
  "Ansi_7_Color",
  "Ansi_8_Color",
  "Ansi_9_Color",
  "Ansi_10_Color",
  "Ansi_11_Color",
  "Ansi_12_Color",
  "Ansi_13_Color",
  "Ansi_14_Color",
  "Ansi_15_Color",
  "Background_Color",
  "Bold_Color",
  "Cursor_Color",
  "Foreground_Color",
];

const EXACT_HEX_MATCH = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const LINE_MATCH = /(?:\r\n|\r|\n)/g;

export function xterm(raw: any): TermScheme {
  if (!is.string(raw) || is.emptyOrWhitespace(raw)) {
    throw new TypeError(`xterm: input must be non-empty string`);
  }

  const data = parse(raw);
  const [error, n] = normalize(data);

  if (error) {
    throw error;
  }

  return {
    0: n.Ansi_0_Color,
    1: n.Ansi_1_Color,
    2: n.Ansi_2_Color,
    3: n.Ansi_3_Color,
    4: n.Ansi_4_Color,
    5: n.Ansi_5_Color,
    6: n.Ansi_6_Color,
    7: n.Ansi_7_Color,
    8: n.Ansi_8_Color,
    9: n.Ansi_9_Color,
    10: n.Ansi_10_Color,
    11: n.Ansi_11_Color,
    12: n.Ansi_12_Color,
    13: n.Ansi_13_Color,
    14: n.Ansi_14_Color,
    15: n.Ansi_15_Color,
    background: n.Background_Color,
    bold: n.Bold_Color,
    cursor: n.Cursor_Color,
    text: n.Foreground_Color
  };
}

function parse(raw: any): {[key: string]: string} {
  if (!is.string(raw)) {
    return {};
  }

  const lines = raw
    .split(LINE_MATCH)
    .filter(Boolean)
    .filter((line: string) => line.charAt(0) !== '!');

  return lines.reduce((acc: {[key: string]: string}, line: string) => {
    const segments = line.split(' ').filter(Boolean);

    if (segments.length !== 3) {
      return acc;
    }

    const [stanza, key, value] = segments;

    if (stanza !== '#define') {
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}

function normalize(data: any): [Error, null] | [null, XfceScheme] {
  if (is.empty(data)) {
    return [new TypeError(`xterm: input must be non-empty config`), null];
  }

  const errors = XTERM_KEYS
    .map(key => {
      if (!(key in data)) {
        return new TypeError(`xterm: missing "${key}"`);
      }

      const val = data[key];

      if (!is.string(val)) {
        return new TypeError(`xterm: "${key}" must be string, received "${typeof val}"`);
      }

      if (!val.match(EXACT_HEX_MATCH)) {
        return new TypeError(`xterm: expected "${key}" to be hex color, received "${val}"`);
      }
    })
    .filter(Boolean);

  if (errors.length > 0) {
    return [new AggregateError(errors), null];
  }

  return [
    null,
    {
      Ansi_0_Color: hexRgb(data.Ansi_0_Color),
      Ansi_1_Color: hexRgb(data.Ansi_1_Color),
      Ansi_2_Color: hexRgb(data.Ansi_2_Color),
      Ansi_3_Color: hexRgb(data.Ansi_3_Color),
      Ansi_4_Color: hexRgb(data.Ansi_4_Color),
      Ansi_5_Color: hexRgb(data.Ansi_5_Color),
      Ansi_6_Color: hexRgb(data.Ansi_6_Color),
      Ansi_7_Color: hexRgb(data.Ansi_7_Color),
      Ansi_8_Color: hexRgb(data.Ansi_8_Color),
      Ansi_9_Color: hexRgb(data.Ansi_9_Color),
      Ansi_10_Color: hexRgb(data.Ansi_10_Color),
      Ansi_11_Color: hexRgb(data.Ansi_11_Color),
      Ansi_12_Color: hexRgb(data.Ansi_12_Color),
      Ansi_13_Color: hexRgb(data.Ansi_13_Color),
      Ansi_14_Color: hexRgb(data.Ansi_14_Color),
      Ansi_15_Color: hexRgb(data.Ansi_15_Color),
      Background_Color: hexRgb(data.Background_Color),
      Bold_Color: hexRgb(data.Bold_Color),
      Cursor_Color: hexRgb(data.Cursor_Color),
      Foreground_Color: hexRgb(data.Foreground_Color)
    },
  ];
}
