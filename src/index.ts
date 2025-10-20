import Entity from './Entity';
import { components } from './constants';
import view from './view';
import { defineComponent, defineFactory, deleteComponent, deleteFactory, hasComponent, hasFactory } from './actions';




export default class ECS {
  static Entity = Entity;
  static view = view;


  static defineComponent = defineComponent;
  static hasComponent = hasComponent;
  static deleteComponent = deleteComponent;


  static defineFactory = defineFactory;
  static hasFactory = hasFactory;
  static deleteFactory = deleteFactory;


  static update(system: System) { system(components); }
  static updateAll (systems: System[]) {
    for (let i = 0; i < systems.length; i++) systems[i](components);
  }
}