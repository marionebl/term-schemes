import is from "@marionebl/is";
import { TermScheme, TermSchemeColor } from "./term-scheme";

const AggregateError = require("aggregate-error");
const { parse } = require("plist");
const { parseBuffer } = require("bplist-parser");

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
    0: toRGB(raw.ANSIBlackColor, "ANSIBlackColor"),
    1: toRGB(raw.ANSIRedColor, "ANSIRedColor"),
    2: toRGB(raw.ANSIGreenColor, "ANSIGreenColor"),
    3: toRGB(raw.ANSIYellowColor, "ANSIYellowColor"),
    4: toRGB(raw.ANSIBlueColor, "ANSIBlueColor"),
    5: toRGB(raw.ANSIMagentaColor, "ANSIMagentaColor"),
    6: toRGB(raw.ANSICyanColor, "ANSICyanColor"),
    7: toRGB(raw.ANSIWhiteColor, "ANSIWhiteColor"),
    8: toRGB(raw.ANSIBrightBlackColor, "ANSIBrightBlackColor"),
    9: toRGB(raw.ANSIBrightRedColor, "ANSIBrightRedColor"),
    10: toRGB(raw.ANSIBrightGreenColor, "ANSIBrightGreenColor"),
    11: toRGB(raw.ANSIBrightYellowColor, "ANSIBrightYellowColor"),
    12: toRGB(raw.ANSIBrightBlueColor, "ANSIBrightBlueColor"),
    13: toRGB(raw.ANSIBrightMagentaColor, "ANSIBrightMagentaColor"),
    14: toRGB(raw.ANSIBrightCyanColor, "ANSIBrightCyanColor"),
    15: toRGB(raw.ANSIBrightWhiteColor, "ANSIBrightWhiteColor"),
    background: toRGB(raw.BackgroundColor, "BackgroundColor"),
    bold: toRGB(raw.TextBoldColor, "TextBoldColor"),
    cursor: toRGB(raw.CursorColor, "CursorColor"),
    text: toRGB(raw.TextColor, "TextColor")
  };
}

/** Convert a NSArchiver base64-encoded Buffer containing NSColor to TermSchemeColor  */
function toRGB(archive: any, name: string): TermSchemeColor {
  if (is.undefined(archive)) {
    throw new TypeError(`Missing ${name}`);
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

  if (!("NSRGB" in color)) {
    throw new TypeError(`Missing NSRGB in color ${name}`);
  }

  return color.NSRGB.toString()
    .replace("\u0000", "")
    .split(" ")
    .map((item: string) => parseFloat(item))
    .map((num: number) => Math.round(num * 255));
}

function parseBplist(input: Buffer): [Error | null, any] {
  try {
    return [null, parseBuffer(input)];
  } catch (err) {
    return [err, null];
  }
}
