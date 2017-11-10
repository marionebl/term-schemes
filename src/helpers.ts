import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import {promisify} from 'util';

const pkgDir = require('pkg-dir');
const readFile = promisify(fs.readFile);

export async function fixture(id: string): Promise<string> {
  const fixtures = path.join(await pkgDir(__dirname), 'fixtures');
  const fixturePath = path.join(fixtures, id);

  if (!fs.existsSync(fixturePath)) {
    const rel = path.relative(process.cwd(), fixturePath);
    const available = await globby([`**/*`], {cwd: fixtures, nodir: true});

    throw new RangeError(`Could not find fixture ${id} at ${rel}. Available fixtures: ${available}`);
  }

  return String(await readFile(fixturePath));
}
