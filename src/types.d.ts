

type ComponentMap<T> = Map<Entity<any>, T>;
type System = (comp: Record<string | symbol, ComponentMap<any>>) => void;
type ECSKey = symbol | string;