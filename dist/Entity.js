"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const namespace_1 = require("./namespace");
const actions_1 = require("./actions");
const { Clear: _Clear, Delete: _Delete, Entries: _Entries, Get: _Get, Has: _Has, Keys: _Keys, Set: _Set, Values: _Values, } = namespace_1.Method;
class Entity {
    /**
     * Object with values for components.
     * Current implementation can't define number-like string keys as numbers, but can see symbols.
     * @param {T} type Object with values of components.
     */
    constructor(type) {
        const ownKeys = Reflect.ownKeys(type), keySet = new Set(ownKeys);
        constants_1.keys[_Set](this, keySet);
        for (let i = 0; i < ownKeys.length; i++) {
            const key = ownKeys[i];
            this[_Set](key, type[key]);
        }
    }
    /**
     * Defines value of field.
     * @param {K extends ECSKey} key
     * @param {V extends T[K]} value
     * @returns {this} instance
     */
    [_Set](key, value) {
        (0, actions_1.defineComponent)(key);
        constants_1.keys[_Get](this).add(key);
        (0, actions_1.getComponent)(key)[_Set](this, (0, actions_1.hasFactory)(key) ? (0, actions_1.getFactory)(key)(value) : value);
        return this;
    }
    ;
    [_Get](key) {
        return (0, actions_1.getComponent)(key)[_Get](this);
    }
    [_Has](key) {
        return constants_1.keys[_Get](this)[_Has](key);
    }
    [_Delete](key) {
        var _a;
        constants_1.keys[_Get](this)[_Delete](key);
        return ((_a = (0, actions_1.getComponent)(key)) === null || _a === void 0 ? void 0 : _a[_Delete](this)) || false;
    }
    [_Clear]() {
        var _a, _b;
        for (const key of this[_Keys]())
            (_a = (0, actions_1.getComponent)(key)) === null || _a === void 0 ? void 0 : _a[_Delete](this);
        (_b = constants_1.keys[_Get](this)) === null || _b === void 0 ? void 0 : _b[_Clear]();
    }
    *[_Keys]() {
        const iterate = constants_1.keys.get(this).keys();
        for (const key of iterate)
            yield key;
    }
    *[_Values]() {
        for (const key of this.keys())
            yield this.get(key);
    }
    *[_Entries]() {
        for (const key of this[_Keys]())
            yield [key, this[_Get](key)];
    }
}
Object.defineProperty(Entity.prototype, Symbol.iterator, Entity.prototype[_Entries]);
exports.default = Entity;
