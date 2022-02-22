import { groupBy } from 'lodash';
import { IViewPluginDesc, UniqueIdManager } from 'tdp_core';
import React from 'react';

export interface IViewChooserAccordionProps {
  /**
   * Views to render
   */
  views: IViewPluginDesc[];

  /**
   * Open view callback
   */
  onSelectedView: (view: IViewPluginDesc) => void;

  /**
   * Currently open view
   */
  selectedView?: IViewPluginDesc;
}

export function ViewChooserAccordion(props: IViewChooserAccordionProps) {
  const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
  const groups = groupBy(props.views, (view) => view.group.name);
  return (
    <div className="view-buttons flex-grow-1 flex-row border-top border-light overflow-auto">
      {Object.keys(groups).map((v, i) => (
        <div className={`accordion-item ${i < Object.keys(groups).length - 1 ? 'border-0 border-bottom border-light' : ''}`} key={i}>
          <button
            className={`accordion-button py-2 btn-text-gray shadow-none text-nowrap ${groups[v].some((v) => v.id === props.selectedView?.id) ? 'active' : ''}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse-${i}-${uniqueSuffix}`}
            aria-expanded="true"
            aria-controls={`collapse-${i}-${uniqueSuffix}`}
          >
            {v}
          </button>

          <div id={`collapse-${i}-${uniqueSuffix}`} className="collapse show" aria-labelledby={v}>
            <div className="d-grid gap-2 px-0 py-1">
              {groups[v].map((view, idx) => (
                <button
                  className={`btn py-1 ps-4 text-start btn-text-gray shadow-none text-nowrap rounded-0 rounded-end me-1 ${
                    view.id === props.selectedView?.id ? 'active' : ''
                  }`}
                  key={idx}
                  onClick={() => props.onSelectedView(view)}
                >
                  {view.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
