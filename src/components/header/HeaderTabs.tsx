import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ETabStates, IOrdinoAppState, setActiveTab} from '../../store';

export function HeaderTabs() {
  const ordinoState: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;

  const dispatch = useDispatch();

  return (
    <ul className="navbar-nav me-auto" data-header="mainMenu">
      <li className={`nav-item ${ordinoState.activeTab === ETabStates.DATASETS ? 'active' : ''}`}>
        <a
          className="nav-link"
          href="#ordino_dataset_tab"
          id="ordino_dataset_tab-tab"
          role="tab"
          aria-controls="ordino_dataset_tab"
          aria-selected="true"
          onClick={
            () => dispatch(setActiveTab({
              activeTab: ETabStates.DATASETS
            }))
          }
        >
          Datasets
        </a>
      </li>
    </ul>
  );
}
