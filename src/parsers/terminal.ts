import is from "@marionebl/is";
import { TermScheme, TermSchemeColor } from "./term-scheme";

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
    throw new TypeError(`iterm2: input must be non-empty string`);
  }

  const raw = parse(input);

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

/**  */
function toRGB(archive: any, name: string): TermSchemeColor {
  if (is.undefined(archive)) {
    throw new TypeError(`Missing NSArchiver archive ${name}`);
  }

  if (!is.buffer(archive)) {
    throw new TypeError(
      `NSArchiver archive must be buffer, was ${is(archive)}`
    );
  }

  const result = parseBuffer(archive);

  if (!Array.isArray(result)) {
    throw new TypeError(`Unexpected NSArchiver archive type: ${is(result)}`);
  }

  if (result.length === 0) {
    throw new TypeError(`Unexpected zero length NSArchiver archive`);
  }

  const [value] = result;

  if (!("$objects" in value)) {
    throw new TypeError(`Missing $objects key in NSArchiver archive`);
  }

  const objects = value["$objects"];

  if (!Array.isArray(objects)) {
    throw new TypeError(`Unexpected NSArchiver $objects type: ${is(result)}`);
  }

  if (objects.length < 1) {
    throw new TypeError(
      `Unexpected length NSArchiver $objects length ${result.length}`
    );
  }

  const color = objects[1];

  if (!("NSRGB" in color)) {
    throw new TypeError(`Missing NSRGB key in NSArchiver color`);
  }

  return color.NSRGB.toString()
    .replace("\u0000", "")
    .split(" ")
    .map((item: string) => parseFloat(item))
    .map((num: number) => Math.round(num * 255));
}
