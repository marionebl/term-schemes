> Parse and normalize common terminal emulator color schemes

# term-schemes

* Supports **n** formats
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

## Supported formats

* [x] iTerm2 `.itermcolors`
* [ ] XTerm `.xrdb`
* [x] Terminator `.config`
* [x] Konsole `.colorscheme`
* [x] Terminal `.terminal`
* [ ] Remmina `.colors`
* [ ] Termite ` `
* [ ] Tilda `.itermcolors_config_0`
* [ ] Xfce `.theme`

## License

Copyright Mario Nebl. term-schemes is released under the MIT license.

## Related

* Test fixtures sourced from [mbadolato/iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes)

## Development

```
npx yarn install
npx yarn start
```
