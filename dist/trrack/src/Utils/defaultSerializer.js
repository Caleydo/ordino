import { toJS } from 'mobx';
function defaultSerializer(obj) {
    if (!obj)
        return {};
    const str = JSON.stringify(toJS(obj), (_, val) => {
        if (val instanceof Set) {
            return {
                type: 'Set',
                arr: Array.from(val),
            };
        }
        if (val instanceof Map) {
            return {
                type: 'Map',
                obj: Object.fromEntries(val),
            };
        }
        return val;
    });
    return JSON.parse(str);
}
export default defaultSerializer;
//# sourceMappingURL=defaultSerializer.js.map