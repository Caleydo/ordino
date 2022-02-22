import React, { ComponentType } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { EStartMenuMode, setActiveTab } from '../../store/menuSlice';

export interface ITab {
  id: string;
  Tab: ComponentType;
  name: string;
}

export interface IStartMenuTabWrapperProps {
  /**
   * List of tabs
   */
  tabs: ITab[];

  /**
   * The currently active (i.e., visible tab)
   * `null` = all tabs are closed
   */
  activeTab: string;

  /**
   * Define the mode of the start menu
   */
  mode: EStartMenuMode;
}

export function StartMenuTabWrapper(props: IStartMenuTabWrapperProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      id="ordino-start-menu"
      className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${
        props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''
      }`}
    >
      {props.tabs.map(({ id, Tab }) => (
        <div
          className={`tab-pane fade ${props.activeTab === id ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
          key={id}
          id={id}
          role="tabpanel"
          aria-labelledby={`${id}-tab`}
        >
          {props.mode === EStartMenuMode.OVERLAY && (
            <div className="container-fluid">
              <div className="row">
                <div className="col position-relative d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      dispatch(setActiveTab(null));
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <Tab />
        </div>
      ))}
    </div>
  );
}
