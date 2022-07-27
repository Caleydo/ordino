import * as React from 'react';
import { EViewMode, IViewPluginDesc } from 'tdp_core';
import { chooserComponents, ViewChooserExtensions } from './config';

export enum EViewChooserMode {
  EMBEDDED,
  OVERLAY,
}

export enum EExpandMode {
  LEFT,
  RIGHT,
}

export interface IViewGroupDesc {
  name: string;
  items: IViewPluginDesc[];
}

export interface IViewChooserProps {
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
   * If true, views for the workbench transitions views are disabled.
   */
  isWorkbenchTransitionDisabled?: boolean;

  /**
   * EMBEDDED = ViewChooser has full width and does not collapse
   * OVERLAY= ViewChooser is collapsed by default and expands left or right on hover
   */
  mode?: EViewChooserMode;

  /**
   * Expand direction when in Overlay mode
   */
  expand?: EExpandMode;

  /**
   * Pass custom classes to chooser
   */
  classNames?: string;

  /**
   * Weather it should be embedded
   */
  isEmbedded: boolean;

  /**
   * Overwrite default components with custom ones
   *
   */
  extensions?: ViewChooserExtensions;
  /**
   * Name used for tooltip of disabled views.
   */
  workbenchName?: string;
}

export function ViewChooser({
  views,
  onSelectedView,
  selectedView,
  showBurgerMenu = true,
  showFilter = true,
  showHeader = true,
  showFooter = true,
  isWorkbenchTransitionDisabled = false,
  mode = EViewChooserMode.EMBEDDED,
  expand = EExpandMode.RIGHT,
  classNames = '',
  workbenchName = '',
  extensions: {
    ViewChooserHeader = chooserComponents.ViewChooserHeader,
    BurgerButton = chooserComponents.BurgerButton,
    SelectedViewIndicator = chooserComponents.SelectedViewIndicator,
    SelectionCountIndicator = chooserComponents.SelectionCountIndicator,
    ViewChooserAccordion = chooserComponents.ViewChooserAccordion,
    ViewChooserFilter = chooserComponents.ViewChooserFilter,
    ViewChooserFooter = chooserComponents.ViewChooserFooter,
  } = {},
}: IViewChooserProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(mode !== EViewChooserMode.EMBEDDED);
  const [embedded, setEmbedded] = React.useState<boolean>(mode === EViewChooserMode.EMBEDDED);
  const [filteredViews, setFilteredViews] = React.useState<IViewPluginDesc[] | []>(views);

  React.useEffect(() => {
    setFilteredViews(views);
  }, [views]);

  React.useEffect(() => {
    setCollapsed(!embedded);
  }, [embedded]);

  const collapsedProps = embedded
    ? {}
    : {
        onMouseEnter: () => setCollapsed(false),
        onMouseLeave: () => setCollapsed(true),
      };

  return (
    <>
      {' '}
      <div
        className={`view-chooser  d-flex flex-shrink-0 align-items-stretch
       ${classNames}
       ${collapsed ? 'collapsed' : ''}
       ${embedded ? 'embedded' : ''}
       ${!embedded && !collapsed ? (expand === EExpandMode.RIGHT ? 'expand-right' : 'expand-left') : ''}`}
        {...collapsedProps}
      >
        <div className={`view-chooser-content bg-white d-flex flex-column justify-content-stretch ${!embedded && !collapsed ? 'shadow' : ''}`}>
          {showHeader && (
            <ViewChooserHeader>
              {showBurgerMenu ? <BurgerButton onClick={() => setEmbedded(!embedded)} /> : null}
              {!collapsed && showFilter ? <ViewChooserFilter views={views} setFilteredViews={setFilteredViews} /> : null}
            </ViewChooserHeader>
          )}

          {collapsed ? (
            <div className="selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center">
              <SelectionCountIndicator selectionCount={5} viewMode={EViewMode.FOCUS} idType="Cellines" />
              <SelectedViewIndicator selectedView={selectedView?.name} availableViews={views.length} />
            </div>
          ) : (
            <ViewChooserAccordion
              workbenchName={workbenchName}
              isWorkbenchTransitionDisabled={isWorkbenchTransitionDisabled}
              views={filteredViews}
              selectedView={selectedView}
              onSelectedView={onSelectedView}
            />
          )}
          {showFooter ? <ViewChooserFooter /> : null}
        </div>
      </div>
    </>
  );
}
