import is from "@marionebl/is";
import { decode } from "ini";
import { normalize } from "path";
import { TermScheme, TermSchemeColor } from "./term-scheme";
import { error } from "util";

const AggregateError = require("aggregate-error");
const hexRgb = require('hex-rgb');

interface TerminatorScheme {
  palette: string;
  background_color: string;
  cursor_color: string;
  foreground_color: string;
}

interface NormalizedTerminatorScheme {
  palette: TermSchemeColor[];
  background: TermSchemeColor;
  cursor: TermSchemeColor;
  text: TermSchemeColor;
}

const TERMINATOR_KEYS = ['background_color', 'cursor_color', 'foreground_color'];
const HEADER_MATCH = /\[\[(.*)\]\]/;
const HEX_MATCH = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{6})/;
const PALETTE_EXPECTATION = "\"palette\" must be list of 15 hex colors delimited by \":\"";

export function terminator(input: any): TermScheme {
  if (!is.string(input) || is.emptyOrWhitespace(input)) {
    throw new TypeError(`terminator: input must be non-empty string`);
  }

  const data = decode(input);

  if (!validateData(data)) {
    throw getDataErrors(data);
  }

  const [err, normalized] = normalizeData(data);

  if (err) {
    throw err;
  }

  return {
    0: normalized.palette[0],
    1: normalized.palette[1],
    2: normalized.palette[2],
    3: normalized.palette[3],
    4: normalized.palette[4],
    5: normalized.palette[5],
    6: normalized.palette[6],
    7: normalized.palette[7],
    8: normalized.palette[8],
    9: normalized.palette[9],
    10: normalized.palette[10],
    11: normalized.palette[11],
    12: normalized.palette[12],
    13: normalized.palette[13],
    14: normalized.palette[14],
    15: normalized.palette[15],
    bold: normalized.text,
    background: normalized.background,
    cursor: normalized.cursor,
    text: normalized.text
  };
}

function getDataErrors(data: any): Error {
  if (isEmpty(data)) {
    throw new TypeError('terminator: config must be non-empty');
  }

  const errors: Error[] = [];

  TERMINATOR_KEYS
    .filter(key => {
      const val = data[key];
      if (is.undefined(val)) {
        errors.push(new TypeError(`terminator: "${key}" missing from config`));
        return false;
      }
      return true;
    })
    .filter(key => {
      const val = data[key];
      if (!is.string(val)) {
        errors.push(new TypeError(`terminator: "${key}" must be string, received ${typeof val}`));
        return false;
      }
      return true;
    })
    .filter(key => {
      const val = data[key];
      if (!val.match(HEX_MATCH)) {
        errors.push(new TypeError(`terminator: "${key}" must be hex color, received "${val}"`));
        return false;
      }
      return true;
    });

  if (is.undefined(data.palette)) {
    errors.push(new TypeError(`terminator: "palette" missing from config`));
  }

  if (!is.string(data.palette)) {
    errors.push(new TypeError(`terminator: "palette" must be string, received "${typeof data.palette}"`));
  }

  if (is.string(data.palette)) {
    const colors = data.palette.split(":");

    if (colors.length !== 16) {
      errors.push(new TypeError(`terminator: ${PALETTE_EXPECTATION}, received "${data.palette}"`));
    }

    const paletteErrors = colors
      .map((color: string, index: number) => {
        if (!color.match(HEX_MATCH)) {
          return new TypeError(`terminator: invalid palette item at index ${index}, expected hex color, received ${color}"`);
        }
      })
      .filter(Boolean);

    if (paletteErrors.length > 0) {
      errors.push(new TypeError(`terminator: ${PALETTE_EXPECTATION}, received "${data.palette}"`));
      errors.push(...paletteErrors);
    }
  }

  return new AggregateError(errors);
}

function normalizeData(data: TerminatorScheme): [Error | null, NormalizedTerminatorScheme] {
  const palette = data.palette
    .split(':')
    .map(color => hexRgb(color));

  return [null, {
    palette,
    background: hexRgb(data.background_color),
    cursor: hexRgb(data.cursor_color),
    text: hexRgb(data.foreground_color)
  }]
}

function validateData(data: any): data is TerminatorScheme {
  if (isEmpty(data)) {
    return false;
  }

  const colorsInvalid = TERMINATOR_KEYS
    .some((key: string) => {
      const val = data[key];
      if (!is.string(val)) {
        return true;
      }
      if (!val.match(HEX_MATCH)) {
        return true;
      }
    });

  if (colorsInvalid) {
    return false;
  }

  if (is.undefined(data.palette)) {
    return false;
  }

  if (!is.string(data.palette)) {
    return false;
  }

  if (!validatePalette(data.palette)) {
    return false;
  }

  return true;
}

function validatePalette(palette: string): boolean {
  const colors = palette.split(':');

  if (colors.length !== 16) {
    return false;
  }

  if (colors.some(c => !is.string(c))) {
    return false;
  }

  return !colors.some(c => Boolean(c.match(HEX_MATCH)));
}

function isEmpty(data: any): boolean {
  return Object.keys(data || {}).every((key) => Boolean(key.match(HEADER_MATCH)));
}
