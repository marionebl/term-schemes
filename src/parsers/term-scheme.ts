export type TermSchemeColor = [number, number, number];

export interface TermScheme {
  /** Black */
  0: TermSchemeColor;
  /** Red */
  1: TermSchemeColor;
  /** Green */
  2: TermSchemeColor;
  /** Yellow */
  3: TermSchemeColor;
  /** Blue */
  4: TermSchemeColor;
  /** Magenta */
  5: TermSchemeColor;
  /** Cyan */
  6: TermSchemeColor;
  /** White */
  7: TermSchemeColor;
  /** Bright Black */
  8: TermSchemeColor;
  /** Bright Red */
  9: TermSchemeColor;
  /** Bright Green */
  10: TermSchemeColor;
  /** Bright Yellow */
  11: TermSchemeColor;
  /** Bright Blue */
  12: TermSchemeColor;
  /** Bright Magenta */
  13: TermSchemeColor;
  /** Bright Cyan */
  14: TermSchemeColor;
  /** Bright White */
  15: TermSchemeColor;
  /** Background color */
  background: TermSchemeColor;
  /** Bold text color */
  bold: TermSchemeColor;
  /** Cursor background color */
  cursor: TermSchemeColor;
  /** Text color */
  text: TermSchemeColor;
}
