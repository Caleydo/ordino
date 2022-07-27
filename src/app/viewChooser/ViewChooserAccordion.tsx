import { groupBy } from 'lodash';
import { I18nextManager, IViewPluginDesc, UniqueIdManager } from 'tdp_core';
import React from 'react';
import { isVisynRankingViewDesc } from '../../views';
import { ChevronIcon } from '../../components/breadcrumb/ChevronIcon';
import { darkenColor } from '../../components/breadcrumb/ChevronSvg';

export interface IViewChooserAccordionProps {
  /**
   * Views to render
   */
  views: IViewPluginDesc[];

  /**
   * Open view callback
   */
  onSelectedView: (view: IViewPluginDesc) => void;
  workbenchName: string;

  /**
   * Currently open view
   */
  selectedView?: IViewPluginDesc;
  isTransitionActive: boolean;
}

/**
 * Using this function to convert to HSL so that we can lighten our colors easily.
 * Taken from https://www.jameslmilner.com/posts/converting-rgb-hex-hsl-colors/#hex-to-hsl
 */
function HexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw new Error('Could not parse Hex Color');
  }

  const rHex = parseInt(result[1], 16);
  const gHex = parseInt(result[2], 16);
  const bHex = parseInt(result[3], 16);

  const r = rHex / 255;
  const g = gHex / 255;
  const b = bHex / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // Achromatic
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
    default:
      break;
  }
  h /= 6;

  s *= 100;
  s = Math.round(s);
  l *= 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return { h, s, l };
}

export function ViewChooserAccordion({ views, onSelectedView, workbenchName, selectedView, isTransitionActive }: IViewChooserAccordionProps) {
  const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
  const groups = groupBy(views, (view) => view.group.name);

  return (
    <div className="view-buttons flex-grow-1 flex-row border-top border-light overflow-auto">
      {Object.keys(groups)
        .sort((a, b) => groups[a][0].group.order - groups[b][0].group.order)
        .map((v, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={`accordion-item border-0 ${i < Object.keys(groups).length - 1 ? 'border-bottom border-light' : ''}`} key={i}>
            <button
              className={`accordion-button btn-text-gray py-2 shadow-none text-nowrap ${groups[v].some((g) => g.id === selectedView?.id) ? 'active' : ''}`}
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
                {groups[v].map((view, idx) => {
                  const isDisabled = isVisynRankingViewDesc(view) && !isTransitionActive;

                  return (
                    <button
                      type="button"
                      className={`d-flex view-chooser-button align-items-center btn-text-gray justify-content-between btn py-1 ps-4 pe-0 text-start shadow-none text-nowrap rounded-0 ${
                        view.id === selectedView?.id ? 'active' : ''
                      }`}
                      style={
                        // need the as typing at the end because of the custom styles.
                        {
                          opacity: isDisabled ? '.3' : '1',
                          cursor: isDisabled ? 'not-allowed' : '1',
                          color: 'black',
                          '--next-workbench-color-h': HexToHSL(view.color).h,
                          '--next-workbench-color-s': `${HexToHSL(view.color).s}%`,
                          '--next-workbench-color-l': `${HexToHSL(view.color).l}%`,
                        } as React.CSSProperties
                      }
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      onClick={() => (isDisabled ? null : onSelectedView(view))}
                      title={isDisabled ? I18nextManager.getInstance().i18n.t('tdp:ordino.views.disabledTransition', { workbenchName }) : null}
                    >
                      <div>{view.name}</div>
                      {isVisynRankingViewDesc(view) ? (
                        <div className="me-3" style={{ width: `1rem` }}>
                          <ChevronIcon color={view.color} />
                        </div>
                      ) : view.icon ? (
                        <i className={`me-3 fs-5 ${view.icon}`} style={{ color: view.color }} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
