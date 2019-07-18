/**
 * Created by sam on 13.11.2016.
 */

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');

function gitHead(cwd) {
  const r = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], {
    cwd: cwd
  });
  if (!r.stdout) {
    console.error(cwd, r.error);
    return 'error';
  }
  return r.stdout.toString().trim();
}

function resolvePlugin(repo, version) {
  if (fs.lstatSync('.git').isDirectory() && repo) {
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, repo.length - 4);
      return repo + '/commit/' + gitHead('.');
    }
  }
  // not a git repo
  return version;
}

function toVersion(v) {
  const now = new Date().toISOString();
  // %Y%m%d-%H%M%S
  const fmt = now
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .replace(/[-:]/, '')
    .replace(' ', '-');
  return v.replace('SNAPSHOT', fmt);
}

function _main() {
  const pkg = require('./package.json');
  const name = pkg.name;
  const version = toVersion(pkg.version);
  const resolved = resolvePlugin((pkg.repository || {}).url, version);

  const buildInfo = {
    name,
    version,
    resolved,
    description: pkg.description,
    homepage: pkg.homepage,
    repository: (pkg.repository || {}).url
  };

  const l = ('build/source/' + name.toLowerCase()).split('/');
  l.forEach((_, i) => {
    const path = l.slice(0, i + 1).join('/');
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });

  fs.writeFileSync('build/source/' + name.toLowerCase() + '/buildInfo.json', JSON.stringify(buildInfo, null, ' '));
}

if (require.main === module) {
  _main();
}
