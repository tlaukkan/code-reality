import {registerPrimitive, primitives, utils} from "aframe";

console.log('registered a-picture.');
export = registerPrimitive('a-picture', utils.extendDeep({}, primitives.getMeshMixin(), {
    defaultComponents: {
        "picture":{}
    },
    mappings: {
        src: 'picture.src',
        width: 'picture.width',
        height: 'picture.height'
    }
}));