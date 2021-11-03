import * as React from 'react';
export function ViewChooserFilter(props) {
    const [filter, setFilter] = React.useState('');
    React.useEffect(() => {
        props.setFilteredViews(props.views.filter((v) => !filter || v.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())));
    }, [filter]);
    return (React.createElement("div", { className: "view-filter input-group flex-nowrap" },
        React.createElement("input", { className: "form-control border-end-0", type: "search", placeholder: "Search", value: filter, onChange: (evt) => setFilter(evt.target.value) }),
        React.createElement("span", { className: "input-group-text text-secondary bg-transparent border-start-0" },
            React.createElement("button", { className: "btn btn-icon-gray py-0 px-1", type: "button" },
                React.createElement("i", { className: "fas fa-search" })))));
}
//# sourceMappingURL=ViewChooserFilter.js.map