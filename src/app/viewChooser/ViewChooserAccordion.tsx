import { groupBy } from 'lodash';
import { IViewPluginDesc, UniqueIdManager } from 'tdp_core';
import React from 'react';
import { BreadcrumbSvg } from '../../components/breadcrumb/BreadcrumbSvg';
import { isVisynRankingView, isVisynRankingViewDesc } from '../../views';

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

const BREADCRUMB_WIDTH = 180;

export function ViewChooserAccordion(props: IViewChooserAccordionProps) {
  const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
  const groups = groupBy(props.views, (view) => view.group.name);

  return (
    <div className="view-buttons flex-grow-1 flex-row border-top border-light overflow-auto">
      {Object.keys(groups)
        .sort((a, b) => groups[a][0].group.order - groups[b][0].group.order)
        .map((v, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={`accordion-item ${i < Object.keys(groups).length - 1 ? 'border-0 border-bottom border-light' : ''}`} key={i}>
            <button
              className={`accordion-button py-2 btn-text-gray shadow-none text-nowrap ${
                groups[v].some((g) => g.id === props.selectedView?.id) ? 'active' : ''
              }`}
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
                {groups[v].map((view, idx) =>
                  isVisynRankingViewDesc(view) ? (
                    <div className="ps-2 pb-1 d-flex align-items-center cursor-pointer justify-content-center" onClick={() => props.onSelectedView(view)}>
                      <div className="position-absolute d-flex align-items-center" style={{ width: `${BREADCRUMB_WIDTH}px` }}>
                        <BreadcrumbSvg key={view.id} backgroundColor="white" color={view.color} width={BREADCRUMB_WIDTH} height={30} first={false} clickable />
                      </div>
                      <div className="pe-none" style={{ zIndex: 10, color: 'white' }}>
                        {view.name}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`btn py-1 ps-4 text-start btn-text-gray shadow-none text-nowrap rounded-0 rounded-end me-1 ${
                        view.id === props.selectedView?.id ? 'active' : ''
                      }`}
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      onClick={() => props.onSelectedView(view)}
                    >
                      {view.name}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
