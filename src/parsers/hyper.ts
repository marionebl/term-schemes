import { inspect, error } from "util";
import * as Color from "color";
import is from "@marionebl/is";
import * as requireFromString from "require-from-string";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");

type LegacyHyperColors = string[];

interface HyperColors {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  lightBlack: string;
  lightRed: string;
  lightGreen: string;
  lightYellow: string;
  lightBlue: string;
  lightMagenta: string;
  lightCyan: string;
  lightWhite: string;
}

interface HyperConfig {
  config: {
    cursorColor: string;
    foregroundColor: string;
    backgroundColor: string;
    colors: HyperColors | LegacyHyperColors;
  }
}

interface NormalizedHyperConfig {
  cursorColor: string;
  foregroundColor: string;
  backgroundColor: string;
  colors: HyperColors;
}

export interface HyperParserConfig {
  filename: string;
}

const REQUIRED_KEYS = ['cursorColor', 'foregroundColor', 'backgroundColor', 'colors'];
const EXTRA_COLORS = ['cursorColor', 'foregroundColor', 'backgroundColor'];
const REQUIRED_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'lightBlack', 'lightRed', 'lightGreen', 'lightYellow', 'lightBlue', 'lightMagenta', 'lightCyan', 'lightWhite'];

export function hyper(input: string, parserConfig: HyperParserConfig): TermScheme {
  if (!is.string(input) || is.emptyOrWhitespace(input)) {
    throw new TypeError(`hyper: input must be non-empty string`);
  }

  if (!is.plainObject(parserConfig)) {
    throw new TypeError(`hyper: parserConfig must be object`);
  }

  if (typeof parserConfig.filename !== 'string') {
    throw new TypeError(`hyper: parserConfig.filename must be string`);
  }

  const data = requireFromString(input, parserConfig.filename);

  if (!isHyperConfig(data)) {
    const errs = getHyperConfigErrors(data);
    throw new TypeError(
      `hyper: input is invalid: ${new AggregateError(errs)}`
    );
  }

  const {backgroundColor, colors, cursorColor, foregroundColor} = normalizeHyperConfig(data);

  return {
    0: get(colors.black),
    1: get(colors.red),
    2: get(colors.green),
    3: get(colors.yellow),
    4: get(colors.blue),
    5: get(colors.magenta),
    6: get(colors.cyan),
    7: get(colors.white),
    8: get(colors.lightBlack),
    9: get(colors.lightRed),
    10: get(colors.lightGreen),
    11: get(colors.lightYellow),
    12: get(colors.lightBlue),
    13: get(colors.lightMagenta),
    14: get(colors.lightCyan),
    15: get(colors.lightWhite),
    background: get(backgroundColor),
    bold: get(foregroundColor),
    cursor: get(cursorColor),
    text: get(foregroundColor)
  };
}

function get(value: string): TermSchemeColor {
  const {r, g, b} = Color(value).object();
  return [r, g, b];
}

function isHyperConfig(data: any): data is HyperConfig {
  if (is.empty(data)) {
    return false;
  }

  if (!('config' in data) || typeof data.config !== 'object') {
    return false;
  }

  const {config} = data;

  if (REQUIRED_KEYS.some(key => !(key in config))) {
    return false;
  }

  if (EXTRA_COLORS.some(key => !isHyperColor(config[key]))) {
    return false;
  }

  return isHyperColors(config.colors);
}

function isHyperColors(colors: any): colors is HyperColors | LegacyHyperColors {
  if (Array.isArray(colors) && colors.length === 16) {
    return true;
  }

  if (typeof colors !== 'object') {
    return false;
  }

  if (REQUIRED_COLORS.some(color => !(color in colors))) {
    return false;
  }

  if (REQUIRED_COLORS.some(color => !isHyperColor(colors[color]))) {
    return false;
  }

  return true;
}

function isHyperColor(color: string) {
  if (!color) {
    return false;
  }

  if (typeof color !== 'string') {
    return false;
  }

  try {
    const parsed = Color(color);
    return true;
  } catch (err) {
    return false;
  }
}

function getHyperConfigErrors(data: any): TypeError[] {
  if (is.empty(data)) {
    return [new TypeError(`expected non-empty object, received ${inspect(data)}`)];
  }

  if (!('config' in data) || typeof data.config !== 'object') {
    return [new TypeError(`expected .config, received ${inspect(data)}`)];
  }

  const {config} = data;
  const errors: TypeError[] = [];

  REQUIRED_KEYS
    .filter(key => !(key in config))
    .forEach((key) => {
      errors.push(new TypeError(`missing "config.${key}"`));
    })

  EXTRA_COLORS
    .filter(key => (key in config))
    .filter(key => !isHyperColor(config[key]))
    .forEach((key) => {
      errors.push(new TypeError(`"config.${key}" must be valid color, received "${config[key]}"`));
    })

  REQUIRED_COLORS
    .filter(key => !(key in config.colors))
    .forEach((key) => {
      errors.push(new TypeError(`missing "config.colors.${key}"`));
    })

  REQUIRED_COLORS
    .filter(key => (key in config.colors))
    .filter(key => !isHyperColor(config.colors[key]))
    .forEach((key) => {
      errors.push(new TypeError(`"config.colors.${key}" must be valid color, received "${config[key]}"`));
    })

  return errors;
}

function normalizeHyperConfig(data: HyperConfig): NormalizedHyperConfig {
  const {config} = data;
  const colors = Array.isArray(config.colors) ?
    config.colors.reduce((acc: any, color, index) => {
      const name = REQUIRED_COLORS[index];
      acc[name] = color;
      return acc as NormalizedHyperConfig;
    }, {}) :
    config.colors;

  return {
    backgroundColor: config.backgroundColor,
    cursorColor: config.cursorColor,
    colors,
    foregroundColor: config.foregroundColor
  };
}
