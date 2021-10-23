import * as React from 'react';
import {IViewPluginDesc} from 'tdp_core';

interface IDetailViewFilterProps {
    views: IViewPluginDesc[] | [];
    setFilteredViews: (views: IViewPluginDesc[]) => void;
}
export function DetailViewFilter(props: IDetailViewFilterProps) {
    const [filter, setFilter] = React.useState<string>('');

    React.useEffect(() => {
        props.setFilteredViews(
            props.views.filter((v) => !filter || v.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
        );
    }, [filter]);

    return (
        <div className="view-filter input-group ms-1">
            <input
                className="form-control border-end-0"
                type="search"
                placeholder="Search"
                value={filter}
                onChange={(evt) => setFilter(evt.target.value)}
            />
            <span className="input-group-text text-secondary bg-transparent border-start-0">
                <button className="btn btn-icon-gray py-0 px-1" type="button">
                    <i className="fas fa-search"></i>
                </button>
            </span>
        </div>
    );
}
