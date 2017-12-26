> Parse and normalize common terminal emulator color schemes

# term-schemes

* Supports **10** formats
* Normalizes to common structure
* Works well with svg-term
* TypeScript support

## Example

```js
const termSchemes = require('term-schemes');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function main() {
  const raw = String(await readFile('./Seti.itermcolors'));
  const scheme = termSchemes.iterm2(raw); // => {0: [50, 50, 50], .., background: [17, 18, 19]}
}

```

## API

```ts
// Available methods
export iterm2: Parser;
export konsole: Parser;
export remmina: Parser;
export terminal: Parser;
export terminator: Parser;
export termite: Parser;
export tilda: Parser;
export xfce: Parser;
export xresources: Parser;
export xterm: Parser;

type Parser = (input: any) => TermScheme;

/** RGB Color: [R, G, B], each item number between 0 and 255 */
type TermSchemeColor = [number, number, number];

interface TermScheme {
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
```

## Supported formats

* [x] Hyper `.js`
* [x] iTerm2 `.itermcolors`
* [x] Konsole `.colorscheme`
* [x] Remmina `.colors`
* [x] Terminal `.terminal`
* [x] Terminator `.config`
* [x] Termite ` `
* [x] Tilda `.config_0`
* [x] Xfce `.theme`
* [x] XTerm `.xrdb`, `Xresources`

## License

Copyright Mario Nebl. term-schemes is released under the MIT license.

## Related

* Test fixtures sourced from [mbadolato/iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes)

## Development

```
npx yarn install
npx yarn start
```
