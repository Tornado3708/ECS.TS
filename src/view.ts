import Entity from "./Entity";
import { METHOD } from "./namespace";



// todo write decriptors
const descriptors = new WeakMap<Entity<any>, PropertyDescriptorMap>();



const handler: ProxyHandler<Entity<any>> = {
  [METHOD.SET] (target, key, value) {
    target.set(key, value);
    return true;
  },



  [METHOD.GET] (target, key) {
    return target[METHOD.GET](key);
  },



  [METHOD.HAS] (target, key) {
    return target[METHOD.HAS](key);
  },




  ['ownKeys'] (target) {
    return Array.from(target[METHOD.KEYS]());
  },
  
  ['setPrototypeOf']: () => false,
  ['getPrototypeOf']: () => null,
};


export default function view <T extends object>(entity: Entity<T>): T {
  descriptors.set(entity, Object.create(null));
  return new Proxy(entity, handler) as T;
}