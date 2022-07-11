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

  console.log(groups);
  return (
    <div className="view-buttons flex-grow-1 flex-row border-top border-light overflow-auto">
      {Object.keys(groups)
        .sort((a, b) => groups[a][0].group.order - groups[b][0].group.order)
        .map((v, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={`accordion-item ${i < Object.keys(groups).length - 1 ? 'border-0 border-bottom border-light' : ''}`} key={i}>
            <button
              className={`accordion-button btn-text-gray py-2 shadow-none text-nowrap ${
                groups[v].some((g) => g.id === props.selectedView?.id) ? 'active' : ''
              }`}
              type="button"
              style={{ fontWeight: 500, color: 'black' }}
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
                    className={`d-flex align-items-center btn-text-gray justify-content-between btn py-1 ps-4 pe-0 text-start shadow-none text-nowrap rounded-0 rounded-end ${
                      view.id === props.selectedView?.id ? 'active' : ''
                    }`}
                    style={{ color: 'black' }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    onClick={() => props.onSelectedView(view)}
                  >
                    <div>{view.name}</div>
                    {isVisynRankingViewDesc(view) ? (
                      <div className="d-flex h-100 align-items-center" style={{ marginRight: '1.25rem', width: `1.25rem` }}>
                        <BreadcrumbSvg color={view.color} width={BREADCRUMB_WIDTH} height={18} isFirst={false} isClickable={false} />
                      </div>
                    ) : view.icon ? (
                      <i className={`${view.icon}`} style={{ marginRight: '1.25rem', fontSize: '18px', color: view.color }} />
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
