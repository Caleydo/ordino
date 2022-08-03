/* eslint-disable import/no-cycle */
import React, { useMemo } from 'react';
import { defaultIcon } from '../Utils/IconConfig';
export function IconLegend({ colorMap, nodes, config, }) {
    const legendCategories = useMemo(() => {
        const categoryList = [];
        Object.values(nodes).forEach((node) => {
            if (!categoryList.includes(node.data.meta.eventType)) {
                categoryList.push(node.data.meta.eventType);
            }
        });
        return categoryList;
    }, [nodes]);
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } }, legendCategories.map((cat) => {
        var _a, _b, _c, _d;
        return (React.createElement("div", { key: cat, style: { display: 'flex' } },
            React.createElement("svg", { height: "20px", width: "20px" },
                React.createElement("g", { transform: "translate(10, 10)" }, ((_a = config.iconConfig) === null || _a === void 0 ? void 0 : _a[cat]) && config.iconConfig[cat].glyph ? (_d = (_c = (_b = config.iconConfig) === null || _b === void 0 ? void 0 : _b[cat]) === null || _c === void 0 ? void 0 : _c.glyph) === null || _d === void 0 ? void 0 : _d.call(_c) : defaultIcon(colorMap[cat]).glyph())),
            React.createElement("p", { style: { margin: 0 } }, cat)));
    })));
}
//# sourceMappingURL=IconLegend.js.map