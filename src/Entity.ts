import { keys } from "./constants";
import { Method } from "./namespace";
import { defineComponent, getComponent, getFactory, hasFactory } from "./actions";





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






class Entity<T extends Record<ECSKey, any>> {
  /**
   * Object with values for components.
   * Current implementation can't define number-like string keys as numbers, but can see symbols.
   * @param {T} type Object with values of components.
   */
  constructor(type: EntityType<T>) {
    const ownKeys = Reflect.ownKeys(type), keySet = new Set(ownKeys);

    keys[_Set](this, keySet);

    for (let i = 0; i < ownKeys.length; i++) {
      const key = ownKeys[i]; 
      this[_Set](key, type[key]);
    }
  }



  /**
   * @param {K extends ECSKey} key 
   * @param {V extends T[K]} value
   * @returns {this} instance
   */
  [_Set]<K extends ECSKey, V extends T[K]>(key: K, value: V): Entity<K extends keyof T ? T : { [P in K | keyof T]: P extends K ? V : T[P]; }> {
    defineComponent(key);

    (keys[_Get](this) as Set<ECSKey>).add(key);
    getComponent(key)[_Set](this, hasFactory(key) ? getFactory(key)(value) : value);

    return this as unknown as Entity<K extends keyof T ? T : { [P in K | keyof T]: P extends K ? V : T[P]; }>;
  };

  

  /**
   * @param {keyof T} key 
   * @returns {T[K]}
   */
  [_Get]<K extends ECSKey>(key: K): T[K] {
    return getComponent(key)[_Get](this) as T[K];
  }



  /**
   * @param {ECSKey} key 
   * @returns {boolean}
   */
  [_Has](key: ECSKey): boolean {
    return (keys[_Get](this) as Set<ECSKey>)[_Has](key);
  }



  [_Delete](key: ECSKey) {
    return (
      (keys[_Get](this) as Set<ECSKey>)[_Delete](key) &&
      getComponent(key)[_Delete](this)
    ) || false;
  }



  [_Clear]() {
    const keySet = keys.get(this) as Set<ECSKey>;
    for (const key of keySet) {
      getComponent(key)[_Delete](this);
      keySet.delete(key);
    }
  }



  *[_Keys](): Generator<ECSKey> {
    for (const key of (keys.get(this) as NonNullable<ReturnType<typeof keys['get']>>))
      yield key;
  }

  *[_Values]() {
    for (const key of this[_Keys]())
      yield this[_Get](key as any);
  }

  *[_Entries]() {
    for (const key of this[_Keys]())
      yield [key, this[_Get](key as any)];
  }

}



interface Entity<T extends Record<ECSKey, any>> {
  [Symbol.iterator]: this[typeof _Entries];
}



Object.defineProperty(Entity.prototype, Symbol.iterator, Entity.prototype[_Entries]);



export default Entity;



type EntityType<T extends Record<ECSKey, any>> = keyof T extends ECSKey ? T : never;