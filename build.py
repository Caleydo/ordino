import shutil
from codecs import open
import json

__author__ = 'Samuel Gratzl'


def _git_head(cwd):
  import subprocess
  try:
    output = subprocess.check_output(['git', 'rev-parse', '--verify', 'HEAD'], cwd=cwd)
    return output.strip()
  except subprocess.CalledProcessError:
    return 'error'


def _resolve_plugin(repo, version):
  import os.path
  if os.path.isdir('.git') and repo:
    if repo.endswith('.git'):
      repo = repo[0:-4]
    return repo + '/commit/' + _git_head('.')
  # not a git repo
  return version


def to_version(v):
  import datetime
  now = datetime.datetime.utcnow()
  return v.replace('SNAPSHOT', now.strftime('%Y%m%d-%H%M%S'))


with open('package.json', 'r', encoding='utf-8') as f:
  pkg = json.load(f)

name = pkg['name']
version = to_version(pkg['version'])
resolved = _resolve_plugin(pkg.get('repository', {}).get('url'), version)

# copy source code
shutil.rmtree('build/source', ignore_errors=True)
shutil.copytree(name, 'build/source', symlinks=False, ignore=shutil.ignore_patterns('*.pyc'))

# create buildInfo.json
build_info = dict(name=name, version=version, resolved=resolved, description=pkg['description'],
                  homepage=pkg.get('homepage'), repository=pkg.get('repository', {}).get('url'))

# TODO create build Info

with open('build/source/buildInfo.json', 'w', encoding='utf-8') as f:
  json.dump(build_info, f, indent=2)
