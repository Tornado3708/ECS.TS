import { components, factory } from "./constants";



export const
  // region components start
  hasComponent = (name: ECSKey) => (name in components),

  getComponent = (name: ECSKey) => components[name],

  defineComponent = (name: ECSKey) => {
    if (!hasComponent(name)) components[name] = new Map();
  },

  deleteComponent = (name: ECSKey) => delete components[name],
  // region components end



  // region factory start
  hasFactory = (name: ECSKey) => (name in factory),

  getFactory = (name: ECSKey) => {
    if (hasFactory(name)) return factory[name];
    throw Error(`factory ${name.toString()} is undefined`);
  },

  defineFactory = <F extends (arg: any) => any>(name: ECSKey, func: F) => {
    if (typeof func === 'function') factory[name] = func;
    throw Error(`factory is not a function`);
  },

  deleteFactory = (name: ECSKey) => delete factory[name];
  // region factory end