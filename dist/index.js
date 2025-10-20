"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
const constants_1 = require("./constants");
const view_1 = __importDefault(require("./view"));
const actions_1 = require("./actions");
class ECS {
    static update(system) { system(constants_1.components); }
    static updateAll(systems) {
        for (let i = 0; i < systems.length; i++)
            systems[i](constants_1.components);
    }
}
ECS.Entity = Entity_1.default;
ECS.view = view_1.default;
ECS.defineComponent = actions_1.defineComponent;
ECS.hasComponent = actions_1.hasComponent;
ECS.deleteComponent = actions_1.deleteComponent;
ECS.defineFactory = actions_1.defineFactory;
ECS.hasFactory = actions_1.hasFactory;
ECS.deleteFactory = actions_1.deleteFactory;
exports.default = ECS;
