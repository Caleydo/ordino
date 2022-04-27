###############################################################################
# Caleydo - Visualization for Molecular Biology - http://caleydo.org
# Copyright (c) The Caleydo Team. All rights reserved.
# Licensed under the new BSD license, available at http://caleydo.org/license
###############################################################################


from builtins import str
from builtins import range as number_range
from builtins import object
import itertools
from functools import reduce, cmp_to_key
from numpy import NaN, isnan

all_f = all


def fix(v, size=0):
  return v if v >= 0 else (size + 1 + v)


class SingleRangeElem(object):
  def __init__(self, val):
    self.start = val

  @property
  def end(self):
    return self.start + 1

  @property
  def step(self):
    return 1

  def asslice(self):
    return self.start

  @property
  def isall(self):
    return False

  @property
  def issingle(self):
    return True

  @property
  def isunbound(self):
    return False

  def __len__(self):
    return 1

  @staticmethod
  def size(size=0):
    return 1

  def reverse(self):
    return SingleRangeElem(self.start)

  def invert(self, index, size=0):
    return fix(self.start, size) + index

  def __iter__(self):
    return self.iter()

  def iter(self, size=0):
    return iter([self.start])

  def contains(self, value, size=0):
    return fix(self.start, size) == value

  def __in__(self, value):
    return self.contains(value)

  def __str__(self):
    return str(self.start)

  def __eq__(self, other):
    if isinstance(other, self.__class__):
      return self.start == other.start
    return False

  def copy(self):
    return self.__copy__()

  def __copy__(self):
    return SingleRangeElem(self.start)


class RangeElem(object):
  def __init__(self, start, end=-1, step=1):
    self.start = start
    self.end = end
    self.step = step

  @property
  def isall(self):
    return self.start == 0 and self.end == -1 and self.step == 1

  def asslice(self):
    return slice(self.start, self.end, self.step)

  @property
  def issingle(self):
    return (self.start + self.step) == self.end

  @property
  def isunbound(self):
    return self.start < 0 or self.end < 0

  @staticmethod
  def all():
    return RangeElem(0)

  @staticmethod
  def none():
    return RangeElem(0, 0)

  @staticmethod
  def single(val):
    return SingleRangeElem(val)

  @staticmethod
  def range(start, end=-1, step=1):
    if (start + step) == end:
      return RangeElem.single(start)
    return RangeElem(start, end, step)

  def __len__(self):
    return self.size()

  def size(self, size=NaN):
    t = fix(self.end, size)
    f = fix(self.start, size)
    if self.step == 1:
      return max(t - f, 0)
    elif self.step == -1:
      if self.end == -1:
        return max(f - -1, 0)
      return max(f - t, 0)
    d = t - f + 1 if self.step > 0 else f - t + 1
    s = abs(self.step)
    if d <= 0:
      return 0
    return (d // s)

  def reverse(self):
    if self.start > 0:
      t = self.start - 1
      f = self.end - 1
      return RangeElem(f, t, - self.step)
    else:  # step < 0
      t = self.start - 1
      f = self.end - 1
      return RangeElem(f, t, - self.step)

  def invert(self, index, size=0):
    if self.isall:
      return index
    return fix(self.start, size) + index * self.step

  def __iter__(self):
    return self.iter()

  def iter(self, size=0):
    if self.step < 0 and self.end == -1:
      # keep negative to have 0 included
      return iter(number_range(fix(self.start, size), -1, self.step))
    return iter(number_range(fix(self.start, size), fix(self.end, size), self.step))

  def contains(self, value, size=NaN):
    if self.isall:
      return True
    f = fix(self.start, size)
    t = fix(self.end, size)
    if self.step == -1:
      if self.end == -1:
        return 0 <= value <= f
      return (value <= f) and (value > t)
    elif self.step == 1:
      return (value >= f) and (value < t)
    else:
      return value in list(self.iter(size))

  def __in__(self, value):
    return self.contains(value)

  def __str__(self):
    if self.isall:
      return ''
    if self.issingle:
      return str(self.start)
    r = str(self.start) + ':' + str(self.end)
    if self.step != 1:
      r = r + ':' + str(self.step)
    return r

  def __eq__(self, other):
    if isinstance(other, self.__class__):
      return self.start == other.start and self.end == other.end and self.step == other.step
    return False

  def copy(self):
    return self.__copy__()

  def __copy__(self):
    return RangeElem(self.start, self.end, self.step)

  @staticmethod
  def parse(code):
    if len(code) == 0:
      return RangeElem.all()

    def parse_elem(v, default_value=None):
      v = v.strip()
      if len(v) == 0 and default_value is not None:
        return default_value
      try:
        return int(v)
      except ValueError:
        raise Exception('parse error: "' + v + '" is not a valid integer')

    parts = code.split(':')
    if len(parts) == 1:
      return RangeElem.single(parse_elem(parts[0]))
    elif len(parts) == 2:
      return RangeElem(parse_elem(parts[0], 0), parse_elem(parts[1], -1))
    elif len(parts) == 3:
      return RangeElem(parse_elem(parts[0], 0), parse_elem(parts[1], -1), parse_elem(parts[2], 1))
    raise Exception('parse error: "' + code + '" is not a valid range specifier')


class Range1D(object):
  def __init__(self, arg=None):
    if isinstance(arg, list):
      self._elems = arg
    elif isinstance(arg, Range1D):
      self._elems = arg._elems
    else:
      self._elems = []

  def __len__(self):
    return self.size()

  def copy(self):
    return Range1D(self._elems[:])

  def __copy__(self):
    return self.copy()

  def size(self, size=NaN):
    if isnan(size) and self.isunbound:
      return NaN
    return reduce(lambda s, x: s + x.size(size), self._elems, 0)

  @staticmethod
  def all():
    return Range1D([RangeElem.all()])

  @staticmethod
  def single(item):
    return Range1D([RangeElem.single(item)])

  @staticmethod
  def none():
    return Range1D()

  @staticmethod
  def from_list(indices):
    return Range1D(Range1D._compress(indices))

  @staticmethod
  def _compress(indices):
    l = len(indices)
    if l == 0:
      return []
    elif l == 1:
      return [RangeElem.single(indices[0])]
    r = []
    deltas = [e - indices[i] for i, e in enumerate(indices[1:])]
    start = 0
    act = 1

    while act < l:
      while act < l and deltas[start] == deltas[act - 1]:  # while the same delta
        act += 1
      if act == start + 1:  # just a single item used
        r.append(RangeElem.single(indices[start]))
      else:
        # +1 since end is excluded
        # fix while just +1 is allowed and -1 is not allowed
        if deltas[start] == 1:
          r.append(RangeElem.range(indices[start], indices[act - 1] + deltas[start], deltas[start]))
        else:
          for i in number_range(start, act):
            r.append(RangeElem.single(indices[i]))
      start = act
      act += 1
    while start < len(indices):  # corner case by adding act+1, it might happened that last one isn't considered
      r.append(RangeElem.single(indices[start]))
      start += 1
    return r

  @property
  def isall(self):
    return len(self._elems) == 1 and self[0].isall

  @property
  def isnone(self):
    return len(self._elems) == 0

  @property
  def isunbound(self):
    return any((d.isunbound for d in self._elems))

  @property
  def _islist(self):
    return not any(not d.issingle for d in self._elems)

  def append(self, *args):
    def convert(p):
      if isinstance(p, str):
        return RangeElem.parse(p)
      elif isinstance(p, int):
        return RangeElem.single(p)
      elif isinstance(p, list):
        return RangeElem.range(p[0], p[1], p[2])
      return p

    self._elems.extend((convert(p) for p in args))

  def push_slice(self, start, end=-1, step=1):
    self._elems.append(RangeElem(start, end, step))

  def push_list(self, indices):
    self._elems.extend(Range1D._compress(indices))

  def set_slice(self, start, end=-1, step=1):
    self._elems = []
    self.push_slice(start, end, step)

  def set_list(self, indices):
    self._elems = []
    self.push_list(indices)

  def __getitem__(self, i):
    if i < 0:
      i += len(self._elems)
    if i < 0 or i >= len(self._elems):
      return RangeElem.none()
    return self._elems[i]

  def asslice(self, no_ellipsis=False):
    if self.isall:
      return slice(0, -1) if no_ellipsis else Ellipsis
    if self.isnone:
      return []
    if len(self._elems) == 1:
      return self._elems[0].asslice()
    return self.tolist()

  @property
  def is_identity_range(self):
    return len(self._elems) == 1 and self._elems[0].start == 0 and self._elems[0].step == 1

  def repeat(self, ntimes=1):
    if ntimes == 1:
      return self
    r = []
    for i in number_range(ntimes):
      r.extend(self._elems)
    return Range1D(r)

  def pre_multiply(self, sub, size=0):
    if self.isall:
      return sub
    if sub.isall:
      return self
    if self.is_identity_range:  # identity lookup
      return sub

    # TODO optimize
    l = list(self.iter(size))
    s = sub.iter(len(l))
    r = []
    while s.hasNext():
      i = next(s)
      if 0 <= i < len(l):  # check for out of range
        r.append(l[i])

    return Range1D.from_list(r)

  def union(self, other, size=0):
    if self.isall or other.isnone:
      return self

    if other.isall or self.isnone:
      return other

    r = list(self.iter(size))
    it2 = other.iter(size)
    for i in it2:
      if i not in r:
        r.append(i)

    return Range1D.from_list(sorted(r))

  def intersect(self, other, size=0):
    if self.isnone or other.isnone:
      return Range1D.none()

    if self.isall:
      return other

    if other.isall:
      return self

    it1 = list(self.iter(size))
    it2 = other.iter(size)
    r = [i for i in it2 if i in it1]
    return Range1D.from_list(sorted(r))

  def without(self, without, size=0):
    if self.isnone or without.isnone:
      return self.copy()

    if without.isall:
      return Range1D.none()

    it1 = self.iter(size)
    it2 = list(without.iter(size))
    r = [i for i in it1 if i not in it2]
    return Range1D.from_list(sorted(r))

  def invert(self, index, size=0):
    if self.isall:
      return index

    if self.isnone:
      return -1  # not mapped

    act = 0
    s = self._elems[0].size(size)
    total = s
    while total > index and act < len(self):
      act += 1
      s = self._elems[act].size(size)
      total += s

    if act >= len(self._elems):
      return -1  # not mapped

    return self._elems[act - 1].invert(index - total + s, size)

  def index(self, *args):
    if len(args) == 0:
      return []

    if isinstance(args[0], Range1D):
      return self.index_range_of(args[0], args[1])
    base = list(self.iter())
    if len(args) == 1:
      if type(args[0]) is int:
        return base.index(args[0])
      arr = args[0]
    else:
      arr = args
    return [base.index(index) for index in arr]

  def index_range_of(self, r, size=0):
    if r.isnone or self.isnone:
      return Range1D.none()
    if self.is_identity_range:
      end = self._elems[0].end
      result = [d for d in r if 0 <= d < end]
    else:
      arr = list(self.iter())
      result = [arr.index(d) for d in arr if d in arr]
    return Range1D.from_list(result)

  def filter(self, data, size, transform=lambda x: x):
    if self.isall:
      return [transform(x) for x in data]
    return [transform(data[i]) for i in self.iter(size)]

  def iter(self, size=0):
    if self._islist:
      return (d.start for d in self._elems)
    else:
      return itertools.chain(*[d.iter(size) for d in self._elems])

  def __iter__(self):
    return self.iter()

  def tolist(self, size=0):
    return list(self.iter(size))

  def contains(self, value, size=0):
    return any(elem.contains(value, size) for elem in self._elems)

  def sort(self, cmp):
    arr = list(self.iter())
    arr.sort(key=cmp_to_key(cmp))
    return Range1D.from_list(arr)

  def remove_duplicates(self, size=0):
    arr = list(self.iter())
    arr.sort()
    arr = [di for i, di in enumerate(arr) if di != arr[i - 1]]  # same value as before, remove
    return Range1D.from_list(arr)

  def reverse(self):
    a = [r.reverse() for r in self._elems]
    a = a.reverse()
    return Range1D(a)

  def __str__(self):
    if self.isall:
      return ''

    if len(self) == 1:
      return str(self._elems[0])

    return '(' + ','.join(str(e) for e in self._elems) + ')'


class Range1DGroup(Range1D):
  def __init__(self, name, color, base=None):
    super(Range1DGroup, self).__init__(base)
    self.name = name
    self.color = color

  def pre_multiply(self, sub, size=0):
    r = super(Range1DGroup, self).pre_multiply(sub, size)
    return Range1DGroup(self.name, self.color, r)

  def union(self, other, size=0):
    r = super(Range1DGroup, self).union(other, size)
    return Range1DGroup(self.name, self.color, r)

  def intersect(self, other, size=0):
    r = super(Range1DGroup, self).intersect(other, size)
    return Range1DGroup(self.name, self.color, r)

  def without(self, without, size=0):
    r = super(Range1DGroup, self).without(without, size)
    return Range1DGroup(self.name, self.color, r)

  def sort(self, cmp):
    r = super(Range1DGroup, self).sort(cmp)
    return Range1DGroup(self.name, self.color, r)

  def __str__(self):
    return '"' + self.name + '""' + self.color + '"' + str(super(Range1DGroup, self))


def as_ungrouped(range):
  return Range1DGroup('unnamed', 'gray', range)


def composite(name, groups):
  return CompositeRange1D(name, groups)


def to_base(groups):
  if len(groups) == 1:
    return groups[0]
  r = groups[0].tolist()
  for g in groups[1:]:
    r.extend((i for i in g if i not in r))
  return Range1D.from_list(r)


class CompositeRange1D(Range1D):
  def __init__(self, name, groups, base=None):
    super(CompositeRange1D, self).__init__(base if base is not None else to_base(groups))
    self.name = name
    self.groups = groups

  def pre_multiply(self, sub, size=0):
    r = super(CompositeRange1D, self).pre_multiply(sub, size) if len(self.groups) > 1 else None
    return CompositeRange1D(self.name, [g.pre_multiply(sub, size) for g in self.groups], r)

  def union(self, other, size=0):
    r = super(CompositeRange1D, self).union(other, size) if len(self.groups) > 1 else None
    return CompositeRange1D(self.name, [g.union(other, size) for g in self.groups], r)

  def intersect(self, other, size=0):
    r = super(CompositeRange1D, self).intersect(other, size) if len(self.groups) > 1 else None
    return CompositeRange1D(self.name, [g.intersect(other, size) for g in self.groups], r)

  def without(self, without, size=0):
    r = super(CompositeRange1D, self).without(without, size) if len(self.groups) > 1 else None
    return CompositeRange1D(self.name, [g.without(without, size) for g in self.groups], r)

  def sort(self, cmp):
    r = super(CompositeRange1D, self).sort(cmp) if len(self.groups) > 1 else None
    return CompositeRange1D(self.name, [g.sort(cmp) for g in self.groups], r)

  def __str__(self):
    return '"' + self.name + '":' + ','.join((str(g) for g in self.groups)) + ''


class Range(object):
  def __init__(self, dims=[]):
    self.dims = dims

  @property
  def isall(self):
    return all_f((d.isall for d in self.dims))

  @property
  def isnone(self):
    return all_f((d.isnone for d in self.dims))

  @property
  def ndim(self):
    return len(self.dims)

  def __getitem__(self, item):
    if len(self.dims) > item:
      return self.dims[item]
    for i in number_range(len(self.dims), item + 1):
      self.dims.append(Range1D.all())
    return self.dims[item]

  def __setitem__(self, key, value):
    self.dims[key] = value

  def __len__(self):
    return len(self.dims)

  def __eq__(self, other):
    if self is other or (self.isall and other.isall) or (self.isnone or other.isnone):
      return True
    return str(self) == str(other)

  def pre_multiply(self, other, size=[]):
    if self.isall:
      return other.copy()
    if other.isall:
      return self.copy()
    return Range([d.pre_multiply(other[i], size[i] if i >= len(size) else 0) for i, d in enumerate(self.dims)])

  def union(self, other, size=[]):
    if self.isall or other.isnone:
      return self.copy()
    if other.isall or self.isnone:
      return other.copy()
    return Range([d.union(other[i], size[i] if i >= len(size) else 0) for i, d in enumerate(self.dims)])

  def intersect(self, other, size=[]):
    if self.isnone or other.isnone:
      return none()
    if self.isall:
      return other.copy()
    if other.isall:
      return self.copy()

    return Range([d.intersect(other[i], size[i] if i >= len(size) else 0) for i, d in enumerate(self.dims)])

  def without(self, without, size=[]):
    if self.isnone or without.isnone:
      return self.copy()
    if without.isall:
      return none()

    return Range([d.without(without[i], size[i] if i >= len(size) else 0) for i, d in enumerate(self.dims)])

  def copy(self):
    return Range([d.copy() for d in self.dims])

  def asslice(self, no_ellipsis=False):
    if self.isall:
      return Ellipsis
    return tuple((d.asslice(no_ellipsis) for d in self.dims))

  def swap(self):
    a = [d.copy() for d in self.dims]
    a.reverse()
    return Range(a)

  def filter(self, data, size=[]):
    if self.isall:
      return data

    ndim = self.ndim

    # recursive variant for just filtering the needed rows
    def filter_dim(i):
      if i >= ndim:
        return lambda x: x
      d = self[i]
      nex = filter_dim(i + 1)
      s = size[i] if len(size) > i else 0
      return lambda elem: d.filter(elem, s, nex) if isinstance(elem, list) else elem

    f = filter_dim(0)
    return f(data)

  def invert(self, indices, size=[]):
    if self.isall:
      return indices
    return [self.dim(i).invert(index, size[i] if len(size) > i else 0) for i, index in enumerate(indices)]

  def index_of_range(self, r, size=[]):
    if r.isnone or self.isnone:
      return none()
    if self.isnone or r.isall:
      return self.copy()
    return Range([d.index_range_of(r[i], size[i] if len(size) > i else 0) for i, d in enumerate(self.dims)])

  def index(self, index_or_range, *args):
    if type(index_or_range) is Range:
      return self.index_of_range(index_or_range, args[0])
    if len(args) == 0:
      if type(index_or_range) is int:
        return self[0].index(index_or_range)
      arr = index_or_range
    else:
      arr = [index_or_range]
      arr.extend(args)
    if len(arr) == 0:
      return []
    return [self[i].index(index) for i, index in enumerate(arr)]

  def size(self, size=[]):
    if self.isall:
      return size
    return [r.size(size[i] if len(size) > i else 0) for i, r in enumerate(self.dims)]

  def split(self):
    return [Range([dim]) for dim in self.dims]

  def __str__(self):
    return ','.join((str(d) for d in self.dims))

  def __iter__(self):
    return iter(self.dims)


def all():
  return Range()


def none():
  return Range([Range1D.none(), Range1D.none()])


def from_slice(start, end=-1, step=1):
  r = Range()
  r[0].set_slice(start, end, step)
  return r


def range(*args):
  if len(args) == 0:
    return all()
  r = Range()
  if isinstance(args[0], list):
    for i, arr in enumerate(args):
      if len(arr) == 0:
        continue
      r[i].set_slice(arr[0], arr[1], arr[2])
  if type(args[0]) is int:
    r[0].set_slice(args[0], args[1], args[2])

  return r


def join(*args):
  if len(args) == 0:
    return all()
  r = Range()
  if isinstance(args[0], list):
    args = args[0]
  r.dims = [ri[0] for ri in args]
  return r


def from_list(*args):
  if len(args) == 0:
    return all()
  r = Range()
  if isinstance(args[0], list) and type(args[0][0]) is Range1D:
    r.dims = args[0]
  elif isinstance(args[0], list):  # array mode
    for i, arr in enumerate(args):
      if type(arr) is Range1D:
        r[i] = arr
      else:
        r[i].set_list(arr)
  elif type(args[0]) is int:  # single slice mode
    r[0].set_list(args)
  elif type(args[0]) is Range1D:
    r.dims = args
  return r


# Range EBNF grammar
# R   = Dim : ',' Dim
# Dim = '' | SR | '(' SR : ',' SR '  ')'
# SR  = N [ ':' N [ ':' N ] ]
# N   = '0'...'9'
# Str =  '"' literal '"'
# Name= Str
# Col = Str
# GDim= Name Col Dim
# CDim= Name ':' GDim : ',' GDim  ''
def parse_range(code):
  act = 0
  dims = []
  code = code.strip()
  while act < len(code):
    c = code[act]
    if c == '"':
      act, dim = parse_named_range1d(code, act)
      act += 1  # skip ,
      dims.append(dim)
    elif c == ',':
      act += 1
      dims.append(Range1D.all())
    else:
      ract, dim = parse_range1d(code, act)
      act = ract + 1  # skip ,
      dims.append(dim)
  return Range(dims)


def parse_named_range1d(code, act):
  act += 1  # skip "
  end = code.index('"', act)
  name = code[act:end]
  act = end + 1
  c = code[act]
  if c == '"':
    end = code.index('"', act + 1)
    ract, dim = parse_range1d(code, end + 1)
    return ract, Range1DGroup(name, code[act + 1:end], dim)
  elif c == '{':
    groups = []
    while code[act] != '}':
      ract, dim = parse_named_range1d(code, act + 1)
      groups.append(dim)
      act = ract
    return act + 1, CompositeRange1D(name, groups)
  else:  # error
    return act, Range1D.all()


def parse_range1d(code, act):
  if act >= len(code):
    return act, Range1D.all()
  c = code[act]
  if c == ',' or c == '{':
    n = act
    r = Range1D.all()
  elif c == '(':
    n = code.index(')', act)
    r = Range1D([RangeElem.parse(ni) for ni in code[act + 1: n].split(',')])
    n += 1
  else:
    n = code.find(',', act)
    n2 = code.find('}', act)
    if n >= 0 and n2 >= 0:
      n = min(n, n2)
    elif n < 0:
      n = n2

    if n < 0:
      n = len(code)
    r = Range1D([RangeElem.parse(code[act:n])])
  return n, r


def parse(*args):
  if len(args) == 0:
    return all()
  if len(args) == 1 and type(args[0]) is Range:
    return args[0]
  return parse_range(','.join(args))
