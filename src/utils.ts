const MIN = 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;

const areas: [number, string | ((d: number) => string)][] = [
  [-1, 'in the future'],
  [43, 'a few seconds ago'],
  [44, '44 seconds ago'],
  [89, 'a minute ago'],
  [44 * MIN, (d) => `${Math.ceil(d / MIN)} minutes ago`],
  [89 * MIN, 'an hour ago'],
  [21 * HOUR, (d) => `${Math.ceil(d / HOUR)} hours ago`],
  [35 * HOUR, 'a day ago'],
  [25 * DAY, (d) => `${Math.ceil(d / DAY)} days ago`],
  [45 * DAY, 'a month ago'],
  [319 * DAY, (d) => `${Math.ceil(d / DAY / 30)} months ago`],
  [547 * DAY, (d) => 'a year ago']
];

/**
 * see http://momentjs.com/docs/#/displaying/fromnow/
 * @param {Date} date
 */

export function fromNow(date: Date | number) {
  const now = Date.now();
  const deltaInSeconds = Math.floor((now - (typeof date === 'number' ? date : date.getTime())) / 1000);

  const area = areas.find((d) => deltaInSeconds <= d[0]);
  if (area) {
    const formatter = area[1];
    return typeof formatter === 'string' ? formatter : formatter(deltaInSeconds);
  }
  return 'far far away';
}
