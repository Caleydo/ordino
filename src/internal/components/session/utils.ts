export function byDateDesc(a: any, b: any) {
  return -((a.ts || 0) - (b.ts || 0));
}
