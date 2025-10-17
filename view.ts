import Entity from "./Entity";



/**
 * Returns proxy for operations over entity.
 * If code has accessors they should be written as for entity.
 * @example this.x // wrong
 * this.get('x') // right
 * @param {Entity<T>} e entity 
 * @returns {T} proxy
 */
export default function view <T extends object>(e: Entity<T>): T {
  const target = Object.create(null);
  const proxy = new Proxy(target, createHandler(e));
  return proxy;
}


function createHandler <T extends object>(e: Entity<T>): ProxyHandler<T> {
  return {
    set (t, p, v) {
      const desc = Object.getOwnPropertyDescriptor(t, p);

      if (desc) {
        if (desc.set) {
          desc.set.call(e, v);
          return true;
        }
        if (desc.writable) {
          e.set(p as keyof T, v);
          return true;
        }
        return true;
      }

      e.set(p as keyof T, v);
      return true;
    },

    get (t, p) {
      const desc = Object.getOwnPropertyDescriptor(t, p);

      if (desc) {
        if (desc.get) {
          return desc.get.call(e);
        }
      }

      return e.get(p as keyof T);
    },

    has (_, p) {
      return e.has(p);
    },

    ownKeys (_) {
      return Array.from(e.keys()) as Array<symbol | string>;
    },

    getOwnPropertyDescriptor (t, p) {
      const desc = Object.getOwnPropertyDescriptor(t, p);
      
      if (!desc) return;

      if ('writable' in desc) return Object.assign({}, desc, {value: e.get(p as keyof T)});

      return Object.assign({}, desc);
    },

    defineProperty(t, p, a) {
      if ('value' in a) {
        e.set(p as keyof T, a.value);
        return Reflect.defineProperty(t, p, {enumerable: a.enumerable, configurable: a.configurable, writable: a.writable});
      }

      return Reflect.defineProperty(t, p, a);
    },
    deleteProperty (t, p) {
      return e.delete(p as keyof T) && delete t[p as keyof T];
    },

    getPrototypeOf () { return null; },
    setPrototypeOf () { return false; },
    preventExtensions(t) {
        Object.preventExtensions(t);
        return true;
    },
    isExtensible (t) {
      return Object.isExtensible(t);
    }
  };
}