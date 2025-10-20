import Entity from "./Entity";

export const 
  components = Object.create(null) as Record<string | symbol, Map<Entity<any>, any>>,
  keys = new Map<Entity<any>, Set<string | symbol>>(),
  factory = Object.create(null) as Record<string | symbol, (arg: any) => any>;