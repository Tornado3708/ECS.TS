import { keys } from "./constants";
import { METHOD } from "./namespace";
import { defineComponent, getComponent, getFactory, hasFactory } from "./actions";





class Entity<T extends Record<ECSKey, any>> {
  /**
   * Object with values for components.
   * Current implementation can't define number-like string keys as numbers, but can see symbols.
   * @param {T} type Object with values of components.
   */
  constructor(type: EntityType<T>) {
    const ownKeys = Reflect.ownKeys(type), keySet = new Set(ownKeys);

    keys[METHOD.SET](this, keySet);

    for (let i = 0; i < ownKeys.length; i++) {
      const key = ownKeys[i];
      this[METHOD.SET](key, type[key]);
    }
  }



  /**
   * @param {K extends ECSKey} key 
   * @param {V extends T[K]} value
   * @returns {this} instance
   */
  [METHOD.SET]<K extends ECSKey, V extends T[K]>(key: K, value: V): Entity<K extends keyof T ? T : { [P in K | keyof T]: P extends K ? V : T[P]; }> {
    defineComponent(key);

    (keys[METHOD.GET](this) as Set<ECSKey>).add(key);
    getComponent(key)[METHOD.SET](this, hasFactory(key) ? getFactory(key)(value) : value);

    return this as unknown as Entity<K extends keyof T ? T : { [P in K | keyof T]: P extends K ? V : T[P]; }>;
  };



  /**
   * @param {keyof T} key 
   * @returns {T[K]}
   */
  [METHOD.GET]<K extends ECSKey>(key: K): T[K] {
    return getComponent(key)[METHOD.GET](this) as T[K];
  }



  /**
   * @param {ECSKey} key 
   * @returns {boolean}
   */
  [METHOD.HAS](key: ECSKey): boolean {
    return (keys[METHOD.GET](this) as Set<ECSKey>)[METHOD.HAS](key);
  }



  [METHOD.DELETE](key: ECSKey) {
    return (
      (keys[METHOD.GET](this) as Set<ECSKey>)[METHOD.DELETE](key) &&
      getComponent(key)[METHOD.DELETE](this)
    ) || false;
  }



  [METHOD.CLEAR]() {
    const keySet = keys.get(this) as Set<ECSKey>;
    for (const key of keySet) {
      getComponent(key)[METHOD.DELETE](this);
      keySet.delete(key);
    }
  }



  *[METHOD.KEYS](): Generator<ECSKey> {
    for (const key of (keys.get(this) as NonNullable<ReturnType<typeof keys['get']>>))
      yield key;
  }

  *[METHOD.VALUES]() {
    for (const key of this[METHOD.KEYS]())
      yield this[METHOD.GET](key as any);
  }

  *[METHOD.ENTRIES]() {
    for (const key of this[METHOD.KEYS]())
      yield [key, this[METHOD.GET](key as any)];
  }

}



interface Entity<T extends Record<ECSKey, any>> {
  [Symbol.iterator]: this[typeof METHOD.ENTRIES];
}



Object.defineProperty(Entity.prototype, Symbol.iterator, Entity.prototype[METHOD.ENTRIES]);



export default Entity;



type EntityType<T extends Record<ECSKey, any>> = keyof T extends ECSKey ? T : never;