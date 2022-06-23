export function isObject(obj) {
    return !!obj && typeof obj === 'object';
}

export function objectify(thing) {
    if (!isObject(thing)) return {};
    return thing;
}

export function get(entity, path) {
    let current = entity;
    for (let i = 0; i < path.length; i += 1) {
        if (current === null || current === undefined) {
            return undefined;
        }
        current = current[path[i]];
    }
    return current;
}

export function normalizeArray(arr) {
    if (Array.isArray(arr)) return arr;
    return [arr];
}

export function isFunc(thing) {
    return typeof thing === 'function';
}

export function inferSchema(thing) {
    if (thing.schema) {
        return thing.schema;
    }
    if (thing.properties) {
        return Object.assign(Object.assign({}, thing), { type: 'object' });
    }
    return thing;
}
