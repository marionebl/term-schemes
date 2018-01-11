import * as util from "util";
import is from "@marionebl/is";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const { parse } = require("plist");
const { parseBuffer } = require("bplist-parser");
const {terminal: terminalDefaults} = require("terminal-default-colors");

interface DefaultMap {
  [name: string]: {rgb: TermSchemeColor};
}

const ADDITIONAL_DEFAULTS: DefaultMap = {
  BackgroundColor: {rgb: [255, 255, 255]},
  TextBoldColor: {rgb: [0, 0, 0]},
  CursorColor: {rgb: [146, 146, 146]},
  CursorTextColor: {rgb: [0, 0, 0]},
  TextColor: {rgb: [0, 0, 0]}
};

interface TerminalData {
  ANSIBlackColor: Buffer;
  ANSIRedColor: Buffer;
  ANSIGreenColor: Buffer;
  ANSIYellowColor: Buffer;
  ANSIBlueColor: Buffer;
  ANSIMagentaColor: Buffer;
  ANSICyanColor: Buffer;
  ANSIWhiteColor: Buffer;
  ANSIBrightBlackColor: Buffer;
  ANSIBrightBlueColor: Buffer;
  ANSIBrightCyanColor: Buffer;
  ANSIBrightGreenColor: Buffer;
  ANSIBrightMagentaColor: Buffer;
  ANSIBrightRedColor: Buffer;
  ANSIBrightWhiteColor: Buffer;
  ANSIBrightYellowColor: Buffer;
  BackgroundColor: Buffer;
  TextBoldColor: Buffer;
  CursorColor: Buffer;
  CursorTextColor: Buffer;
  TextColor: Buffer;
}

export function terminal(input: any): TermScheme {
  if (!is.string(input) || is.emptyOrWhitespace(input)) {
    throw new TypeError(`terminal: input must be non-empty string`);
  }

  const raw = parse(input);

  if (!is.plainObject(raw)) {
    if (is.array(raw) && raw.length === 0) {
      throw new TypeError(`terminal: input must be non-empty p-list, received []`);
    }

    throw new TypeError(`expected type object, received ${is(raw)}`);
  }

  return {
    0: toRGB(raw.ANSIBlackColor, "black"),
    1: toRGB(raw.ANSIRedColor, "red"),
    2: toRGB(raw.ANSIGreenColor, "green"),
    3: toRGB(raw.ANSIYellowColor, "yellow"),
    4: toRGB(raw.ANSIBlueColor, "blue"),
    5: toRGB(raw.ANSIMagentaColor, "magenta"),
    6: toRGB(raw.ANSICyanColor, "cyan"),
    7: toRGB(raw.ANSIWhiteColor, "white"),
    8: toRGB(raw.ANSIBrightBlackColor, "brightBlack"),
    9: toRGB(raw.ANSIBrightRedColor, "brightRed"),
    10: toRGB(raw.ANSIBrightGreenColor, "brightGreen"),
    11: toRGB(raw.ANSIBrightYellowColor, "brightYellow"),
    12: toRGB(raw.ANSIBrightBlueColor, "brightBlue"),
    13: toRGB(raw.ANSIBrightMagentaColor, "brightMagenta"),
    14: toRGB(raw.ANSIBrightCyanColor, "brightCyan"),
    15: toRGB(raw.ANSIBrightWhiteColor, "brightWhite"),
    background: toRGB(raw.BackgroundColor, "BackgroundColor"),
    bold: toRGB(raw.TextBoldColor, "TextBoldColor"),
    cursor: toRGB(raw.CursorColor, "CursorColor"),
    text: toRGB(raw.TextColor, "TextColor")
  };
}

/** Convert a NSArchiver base64-encoded Buffer containing NSColor to TermSchemeColor  */
function toRGB(archive: any, name: string): TermSchemeColor {
  if (is.undefined(archive)) {
    const defaultColor = terminalDefaults.colors.find((c: any) => c.name === name) || ADDITIONAL_DEFAULTS[name] as any;
    if (!defaultColor) {
      throw new TypeError(
        `Missing ${name}`
      );
    }
    return defaultColor.rgb;
  }

  if (!is.buffer(archive)) {
    throw new TypeError(
      `NSArchiver archive must be buffer, was ${is(archive)}`
    );
  }

  const [err, result] = parseBplist(archive);

  if (err) {
    throw new AggregateError([
      new TypeError(`Parsing ${name} failed`),
      err
    ]);
  }

  if (!Array.isArray(result)) {
    throw new TypeError(`Unexpected archive type in ${name}: ${is(result)}`);
  }

  if (result.length === 0) {
    throw new TypeError(`Unexpected zero length archive in ${name}`);
  }

  const [value] = result;

  if (!("$objects" in value)) {
    throw new TypeError(`Missing $objects key in ${name}`);
  }

  const objects = value["$objects"];

  if (!Array.isArray(objects)) {
    throw new TypeError(`Unexpected $objects type of ${name}: ${is(result)}`);
  }

  if (objects.length < 1) {
    throw new TypeError(
      `Unexpected $objects length ${result.length} of ${name}`
    );
  }

  const color = objects[1];
  return parseNSColor(color, name);
}

function parseBplist(input: Buffer): [Error | null, any] {
  try {
    return [null, parseBuffer(input)];
  } catch (err) {
    return [err, null];
  }
}

function parseNSColor(color: any, name: string): TermSchemeColor {
  switch(color.NSColorSpace) {
    case 1:
    case 2: {
      return color.NSRGB.toString()
        .replace("\u0000", "")
        .split(" ")
        .map((item: string) => parseFloat(item))
        .map((num: number) => Math.round(num * 255));
    }
    case 3: {
      const val = parseFloat(String(color.NSWhite));
      const result = Math.round(val * 255);
      return [result, result, result];
    }
    default:
      throw new TypeError(`Unknown NSColorSpace ${color.NSColorSpace} in color ${name}: ${util.inspect(color)}`);
  }
}
