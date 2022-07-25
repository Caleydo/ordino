import * as React from 'react';
import { I18nextManager, IViewPluginDesc } from 'tdp_core';

export interface IViewChooserFilterProps {
  views: IViewPluginDesc[] | [];
  setFilteredViews: (views: IViewPluginDesc[]) => void;
}

export function ViewChooserFilter(props: IViewChooserFilterProps) {
  const [filter, setFilter] = React.useState<string>('');

  React.useEffect(() => {
    props.setFilteredViews(
      // have to cast v to any here to account for view being either an IViewPluginDesc[] or an []
      props.views.filter((v: any) => !filter || v.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())),
    );
    // WARNING: Setting this deps to include props produces an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="view-filter input-group flex-nowrap">
      <input
        className="form-control border-end-0"
        type="search"
        placeholder={I18nextManager.getInstance().i18n.t('tdp:ordino.views.searchViews')}
        value={filter}
        onChange={(evt) => setFilter(evt.target.value)}
      />
      <span className="input-group-text text-secondary bg-transparent border-start-0">
        <button className="btn btn-icon-gray shadow-none py-0 px-1" type="button">
          <i className="fas fa-search" />
        </button>
      </span>
    </div>
  );
}
