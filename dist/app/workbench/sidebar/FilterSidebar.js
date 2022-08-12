import { intersection } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { GlobalQuerySelect } from 'reprovisyn';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setGlobalFilters } from '../../../store';
export function FilterSidebar({ workbench }) {
    const dispatch = useAppDispatch();
    const { globalQueryName, globalQueryCategories, appliedQueryCategories } = useAppSelector((state) => state.ordino);
    const [selectedCategories, setSelectedCategories] = useState(appliedQueryCategories);
    useEffect(() => {
        setSelectedCategories(appliedQueryCategories);
    }, [appliedQueryCategories]);
    const changeQueryFilterSelection = (values) => {
        setSelectedCategories(values);
    };
    const includesCurrentFilter = useMemo(() => {
        var _a;
        return (appliedQueryCategories === null || appliedQueryCategories === void 0 ? void 0 : appliedQueryCategories.length) === ((_a = intersection(appliedQueryCategories, selectedCategories)) === null || _a === void 0 ? void 0 : _a.length) || (selectedCategories === null || selectedCategories === void 0 ? void 0 : selectedCategories.length) === 0;
    }, [selectedCategories, appliedQueryCategories]);
    const hasGlobalFilter = useMemo(() => globalQueryName && (globalQueryCategories === null || globalQueryCategories === void 0 ? void 0 : globalQueryCategories.length), [globalQueryCategories, globalQueryName]);
    const readonly = workbench.index > 0;
    return (React.createElement("div", { style: { width: '320px' }, className: "d-flex flex-column p-2" }, hasGlobalFilter ? (React.createElement(React.Fragment, null,
        readonly ? (React.createElement("div", { className: "alert alert-secondary", role: "alert" }, "This workbench has the below active filter. Go to the first workbench to change this filter.")) : null,
        React.createElement(GlobalQuerySelect, { globalQueryName: globalQueryName, globalQueryCategories: globalQueryCategories, selectedCategories: selectedCategories, onChangeQueryFilterSelection: changeQueryFilterSelection, readonly: readonly }),
        includesCurrentFilter || readonly ? null : (React.createElement("div", { className: "alert alert-warning d-flex align-items-center mt-2", role: "alert" },
            React.createElement("div", null,
                React.createElement("strong", null, "Attention"),
                ": This filter will cause all open subsequent workbenches to be closed."))),
        !readonly ? (React.createElement("button", { type: "button", className: "btn btn-secondary mt-2", onClick: () => dispatch(setGlobalFilters({ appliedQueryCategories: selectedCategories })) }, "Apply")) : null)) : (React.createElement("p", null, "No available filters for your dataset"))));
}
//# sourceMappingURL=FilterSidebar.js.map