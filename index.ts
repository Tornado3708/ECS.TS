import Entity from './Entity';
import { factory, components } from './constants';
import view from './view';





export default class ECS {
  static Entity = Entity;
  static view = view;

  static defineFactory<C extends (arg: any) => any>(componentName: symbol | string, componentFactory: C) {
    factory[componentName] = componentFactory;
  }

  static defineComponent (name: string | symbol) {
    components[name] = new Map();
  }

  static hasComponent (name: string | symbol) {
    return name in components;
  }

  static deleteComponent (name: string | symbol) {
    return delete components[name];
  }

  static update(system: System) { system(components); }
}