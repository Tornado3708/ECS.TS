"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = view;
/**
 * Returns proxy for operations over entity.
 * If code has accessors they should be written as for entity.
 * @example this.x // wrong
 * this.get('x') // right
 * @param {Entity<T>} e entity
 * @returns {T} proxy
 */
function view(e) {
    const target = Object.create(null);
    const proxy = new Proxy(target, createHandler(e));
    return proxy;
}
function createHandler(e) {
    return {
        set(t, p, v) {
            const desc = Object.getOwnPropertyDescriptor(t, p);
            if (desc) {
                if (desc.set) {
                    desc.set.call(e, v);
                    return true;
                }
                if (desc.writable) {
                    e.set(p, v);
                    return true;
                }
                return true;
            }
            e.set(p, v);
            return true;
        },
        get(t, p) {
            const desc = Object.getOwnPropertyDescriptor(t, p);
            if (desc) {
                if (desc.get) {
                    return desc.get.call(e);
                }
            }
            return e.get(p);
        },
        has(_, p) {
            return e.has(p);
        },
        ownKeys(_) {
            return Array.from(e.keys());
        },
        getOwnPropertyDescriptor(t, p) {
            const desc = Object.getOwnPropertyDescriptor(t, p);
            if (!desc)
                return;
            if ('writable' in desc)
                return Object.assign({}, desc, { value: e.get(p) });
            return Object.assign({}, desc);
        },
        defineProperty(t, p, a) {
            if ('value' in a) {
                e.set(p, a.value);
                return Reflect.defineProperty(t, p, { enumerable: a.enumerable, configurable: a.configurable, writable: a.writable });
            }
            return Reflect.defineProperty(t, p, a);
        },
        deleteProperty(t, p) {
            return e.delete(p) && delete t[p];
        },
        getPrototypeOf() { return null; },
        setPrototypeOf() { return false; },
        preventExtensions(t) {
            Object.preventExtensions(t);
            return true;
        },
        isExtensible(t) {
            return Object.isExtensible(t);
        }
    };
}
