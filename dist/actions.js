"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFactory = exports.defineFactory = exports.getFactory = exports.hasFactory = exports.deleteComponent = exports.defineComponent = exports.getComponent = exports.hasComponent = void 0;
const constants_1 = require("./constants");
const 
// region components start
hasComponent = (name) => (name in constants_1.components), getComponent = (name) => constants_1.components[name], defineComponent = (name) => {
    if (!(0, exports.hasComponent)(name))
        constants_1.components[name] = new Map();
}, deleteComponent = (name) => delete constants_1.components[name], 
// region components end
// region factory start
hasFactory = (name) => (name in constants_1.factory), getFactory = (name) => {
    if ((0, exports.hasFactory)(name))
        return constants_1.factory[name];
    throw Error(`factory ${name.toString()} is undefined`);
}, defineFactory = (name, func) => {
    if (typeof func === 'function')
        constants_1.factory[name] = func;
    throw Error(`factory is not a function`);
}, deleteFactory = (name) => delete constants_1.factory[name];
// region components start
exports.hasComponent = hasComponent, exports.getComponent = getComponent, exports.defineComponent = defineComponent, exports.deleteComponent = deleteComponent, 
// region components end
// region factory start
exports.hasFactory = hasFactory, exports.getFactory = getFactory, exports.defineFactory = defineFactory, exports.deleteFactory = deleteFactory;
// region factory end
