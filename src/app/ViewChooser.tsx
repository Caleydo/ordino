import * as React from 'react';
import {UniqueIdManager} from 'phovea_core';
import {ViewChooserFilter} from './chooser/ViewChooserFilter';
import {SelectedViewIndicator} from './chooser/SelectedViewIndicator';
import {BurgerMenu} from './chooser/BurgerMenu';
import {SelectionCountIndicator} from './chooser/SelectionCountIndicator';
import {EViewMode, IViewPluginDesc} from 'tdp_core';
import {groupBy} from 'lodash';
import {ViewChooserFooter} from './chooser/ViewChooserFooter';

export interface IViewGroupDesc {
  name: string;
  items: IViewPluginDesc[];
}

interface IViewChooserProps {
  index: number;
  views: IViewPluginDesc[];
  selectedView?: IViewPluginDesc;
  onSelectedView: (view: IViewPluginDesc, viewIndex: number) => void;
}

export function ViewChooser(props: IViewChooserProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const [embedded, setEmbedded] = React.useState<boolean>(false);
  const [filteredViews, setFilteredViews] = React.useState<IViewPluginDesc[] | []>(props.views);

  const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
  const groupedViews = groupBy(filteredViews, (view) => view.group.name);

  return (
    <> <div
      className={`view-chooser d-flex align-items-stretch ${collapsed ? 'collapsed' : ''}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="view-chooser-content d-flex flex-column justify-content-stretch">

        <header className="d-flex my-2 px-1 justify-content-center align-items-center">
          <BurgerMenu onClick={() => setEmbedded(!embedded)} />
          <ViewChooserFilter views={props.views} setFilteredViews={setFilteredViews} />
        </header>

        {collapsed && (
          <div className="selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center">
            <SelectionCountIndicator selectionCount={5} viewMode={EViewMode.FOCUS} idType="Cellines" />
            <SelectedViewIndicator
              selectedView={props.selectedView?.name}
              availableViews={props.views.length}
            />
          </div>
        )}

        <div className="view-buttons flex-grow-1 flex-row overflow-auto border-top border-light">
          <div >
            {Object.keys(groupedViews).map((v, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header d-flex" id={v}>
                  <button
                    className={`accordion-button btn-text-gray py-2 ${groupedViews[v].some((v) => v.id === props.selectedView?.id) ? 'selected-group' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${i}-${uniqueSuffix}`}
                    aria-expanded="true"
                    aria-controls={`collapse-${i}-${uniqueSuffix}`}
                  >
                    {v}
                  </button>
                </h2>
                <div
                  id={`collapse-${i}-${uniqueSuffix}`}
                  className="accordion-collapse collapse show"
                  aria-labelledby={v}
                >
                  <div className="accordion-body d-grid gap-2 px-0 py-1">
                    {groupedViews[v].map((view, idx) => (
                      <button
                        className={`btn btn-text-gray py-1 ps-4 text-start ${view.id === props.selectedView?.id ? 'selected-view ' : ''}`}
                        key={idx}
                        onClick={() => props.onSelectedView(view, props.index)}
                      >
                        {view.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ViewChooserFooter />
      </div>
    </div>

    </>
  );
}
