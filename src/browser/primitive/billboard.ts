import {registerPrimitive, primitives, utils} from "aframe";

console.log('registered a-billboard.');
export = registerPrimitive('a-billboard', utils.extendDeep({}, primitives.getMeshMixin(), {
    defaultComponents: {
        "billboard":{}
    },
    mappings: {
        src: 'billboard.src',
        width: 'billboard.width',
        height: 'billboard.height'
    }
}));