/**
 * Created by Samuel Gratzl on 13.03.2017.
 */


const values = new Map<string, any>();

/**
 * simple delayed caching approach, you hand in the creator functions that is optionally being called
 * @param key key to store
 * @param creator the function to create in case the values not yet cached
 * @return {any}
 */
export default function cached<T>(key: string, creator: () => T) {
  if (values.has(key)) {
    return values.get(key);
  }
  const v = creator();
  values.set(key, v);
  return v;
}

export function cachedLazy<T>(key: string, creator: () => T): (() => T)  {
  return () => cached(key, creator);
}
