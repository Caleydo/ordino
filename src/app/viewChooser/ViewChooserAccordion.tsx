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

const BREADCRUMB_WIDTH = 30;

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
                {groups[v].map((view, idx) => (
                  <button
                    type="button"
                    className={`d-flex align-items-center justify-content-between btn py-1 ps-4 text-start btn-text-gray shadow-none text-nowrap rounded-0 rounded-end me-1 ${
                      view.id === props.selectedView?.id ? 'active' : ''
                    }`}
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    onClick={() => props.onSelectedView(view)}
                  >
                    <div>{view.name}</div>
                    {isVisynRankingViewDesc(view) ? (
                      <div className="d-flex h-100 align-items-center" style={{ width: `${BREADCRUMB_WIDTH}px` }}>
                        <BreadcrumbSvg color={view.color} width={BREADCRUMB_WIDTH} height={20} isFirst={false} isClickable={false} />
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}