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

const DEFAULTS: {[name: string]: string} = {
  cursorColor: 'rgb(217, 0, 189)',
  foregroundColor: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(0, 0, 0)',
  black: 'rgb(0, 0, 0)',
  red: 'rgb(255, 0, 0)',
  green: 'rgb(0, 255, 0)',
  yellow: 'rgb(253, 255, 0)',
  blue: 'rgb(0, 97, 255)',
  magenta: 'rgb(224, 0, 255)',
  cyan: 'rgb(0, 255, 255)',
  white: 'rgb(208, 208, 208)',
  lightBlack: 'rgb(128, 128, 128)',
  lightRed: 'rgb(255, 0, 0)',
  lightGreen: 'rgb(0, 255, 255)',
  lightYellow: 'rgb(253, 255, 0)',
  lightBlue: 'rgb(0, 97, 255)',
  lightMagenta: 'rgb(224, 0, 255)',
  lightCyan: 'rgb(0, 255, 255)',
  lightWhite: 'rgb(255, 255, 255)',
};

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

  const errs = getHyperConfigErrors(data);

  if (errs.length > 0) {
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

  const {config = {}} = data;
  const {colors = {}} = config;
  const errors: TypeError[] = [];

  EXTRA_COLORS
    .filter(key => (key in config))
    .filter(key => !isHyperColor(config[key]))
    .forEach((key) => {
      errors.push(new TypeError(`"config.${key}" must be valid color, received "${config[key]}"`));
    });

  REQUIRED_COLORS
    .filter(key => (key in colors))
    .filter(key => !isHyperColor(colors[key]))
    .forEach((key) => {
      errors.push(new TypeError(`"config.colors.${key}" must be valid color, received "${colors[key]}"`));
    });

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
    config.colors || {};

  REQUIRED_COLORS.forEach(required => {
    if (!(required in colors)) {
      colors[required] = DEFAULTS[required];
    }
  });

  return {
    backgroundColor: config.backgroundColor || DEFAULTS.backgroundColor,
    cursorColor: config.cursorColor || DEFAULTS.cursorColor,
    colors,
    foregroundColor: config.foregroundColor || DEFAULTS.foregroundColor
  };
}
