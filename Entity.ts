import { keys, components, factory } from "./constants";
import { Method } from "./namespace";



const {
  Clear: _Clear,
  Delete: _Delete,
  Entries: _Entries,
  Get: _Get,
  Has: _Has,
  Keys: _Keys,
  Set: _Set,
  Values: _Values,
} = Method;



class Entity<T extends {[x: string | symbol]: any}> {



  /**
   * Object with values for components.
   * Current implementation can't define number-like string keys as numbers, but can see symbols.
   * @param {T} type Object with values of components.
   */
  constructor(type: T) {
    const ownKeys = Reflect.ownKeys(type), keySet = new Set(ownKeys);
    
    keys[_Set](this, keySet);

    for (let i = 0; i < ownKeys.length; i++) {
      const key = ownKeys[i];

      (factory[_Has](key)
        ? (factory[_Get](key) as (arg: any) => object)(type[key])
        : type[key]
      );
    }
  }



  /**
   * Defines value of field.
   * @param {K extends keyof T} key 
   * @param {V extends T[K]} value
   * @returns {this} instance
   */
  [_Set]<K extends string | symbol, V extends T[K]>(key: K, value: V): { [P in K | keyof T]: [P extends K ? V : T[P]]; } {
    if (!(key in components)) components[key as symbol | string] = new Map();

    (keys[_Get](this) as Set<keyof T>).add(key);
    components[key][_Set](this, value);

    return this as { [P in (keyof T | K)]: [P extends K ? V : T[P]] };
  };



  [_Get]<K extends symbol | string>(key: K): T[K] {
    return components[key][_Get](this) as T[K];
  }



  [_Has](key: PropertyKey): boolean {
    return (keys
      [_Get](this) as Set<keyof T>)
      [_Has](key);
  }



  [_Delete](key: PropertyKey) {
    (keys
      [_Get](this) as Set<PropertyKey>)
      [_Delete](key);

    return components[key]?.[_Delete](this) || false;
  }



  [_Clear]() {
    for (const key of this[_Keys]())
      components[key as string | symbol]?.[_Delete](this);

    keys[_Get](this)?.[_Clear]();
  }



  *[_Keys](): Generator<keyof T> {
    const iterate = (keys.get(this) as Set<keyof T>).values();
    for (const key of iterate) {
      yield key;
    }
  }

  *[_Values]() {
    for (const key of this.keys())
      yield this.get(key as any);
  }

  *[_Entries]() {
    for (const key of this[_Keys]()) yield [key, this[_Get](key as any)];
  }

}


interface Entity<T extends {[key: symbol | string]: any}> {
  [Symbol.iterator]: this[typeof _Entries];
}

Object.defineProperty(Entity.prototype, Symbol.iterator, Entity.prototype[_Entries]);


export default Entity;