export default function differ<T>(obj1: T, obj2: T): import("deep-diff").Diff<T, T>[];
