import * as React from 'react';
import {EViewMode, IViewPluginDesc} from 'tdp_core';
import {ViewChooserFooter} from './components/ViewChooserFooter';
import {ViewChooserHeader} from './components/ViewChooserHeader';
import {chooserComponents, ViewChooserExtensions} from './components';

export enum ECollapseDirection {
  LEFT = 'left',
  RIGHT = 'right'
}
export interface IViewGroupDesc {
  name: string;
  items: IViewPluginDesc[];
}

interface IViewChooserProps {
  /**
   * Available views for idType
   */
  views: IViewPluginDesc[];

  /**
   * Open the view callback
   */
  onSelectedView: (view: IViewPluginDesc) => void;

  /**
   * Currently open view
   */
  selectedView?: IViewPluginDesc;

  /**
   * Show burger menu
   * @default true
   */
  showBurgerMenu?: boolean;

  /**
   * Show filter
   * @default true
   */
  showFilter?: boolean;

  /**
   * Show header
   * @default true
   */
  showHeader?: boolean;

  /**
   * Show footer
   * @default true
   */
  showFooter?: boolean;

  /**
   * @default left
   */

  collapseDirection?: ECollapseDirection;
  extensions?: ViewChooserExtensions;
  // innerProps?: JSX.IntrinsicElements['div'];
}

export function ViewChooser({
  views,
  onSelectedView,
  selectedView,
  showBurgerMenu = true,
  showFilter = true,
  showHeader = true,
  collapseDirection = ECollapseDirection.LEFT,
  extensions: {
    ViewChooserHeader, BurgerButton, SelectedViewIndicator, SelectionCountIndicator, ViewChooserAccordion, ViewChooserFilter, ViewChooserFooter
  } = chooserComponents

}: IViewChooserProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const [embedded, setEmbedded] = React.useState<boolean>(false);
  const [filteredViews, setFilteredViews] = React.useState<IViewPluginDesc[] | []>(views);
  const ref = React.useRef(null);

  React.useEffect(() => {
    setCollapsed(!embedded);

  }, [embedded]);

  return (
    <> <div
      className={`view-chooser d-flex flex-shrink-0 align-items-stretch ${collapsed ? 'collapsed' : ''} ${embedded ? 'embedded' : ''}
      ${!embedded ? collapseDirection || ECollapseDirection.LEFT : ''}`}
      onMouseEnter={() => {
        if (embedded) {
          return;
        }
        setCollapsed(false);
      }}
      onMouseLeave={(evt) => {
        if (embedded) {
          return;
        }
        setCollapsed(true);
      }}>

      <div ref={ref} className="view-chooser-content d-flex flex-column justify-content-stretch" >

        {showHeader && <ViewChooserHeader>
          {showBurgerMenu && <BurgerButton onClick={() => setEmbedded(!embedded)} />}
          {(!collapsed && showFilter) && <ViewChooserFilter views={views} setFilteredViews={setFilteredViews} />}
        </ViewChooserHeader>}

        {collapsed ?
          <div className="selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center">
            <SelectionCountIndicator selectionCount={5} viewMode={EViewMode.FOCUS} idType="Cellines" />
            <SelectedViewIndicator selectedView={selectedView?.name} availableViews={views.length} />
          </div> :
          <ViewChooserAccordion views={filteredViews} selectedView={selectedView} onSelectedView={onSelectedView} />
        }
        <ViewChooserFooter />

      </div>
    </div>

    </>
  );
}
