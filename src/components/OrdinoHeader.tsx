import React from 'react';
import { LoginUtils } from 'tdp_core';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { EStartMenuMode, setActiveTab, setMode } from '../store';
import { HeaderTabs } from './header/HeaderTabs';
import { ITab, StartMenuTabWrapper } from './header/StartMenuTabWrapper';
import { IVisynHeaderProps, VisynHeader } from '../visyn';
import { VisynLoginLink } from '../visyn/LoginMenu';

export interface IOrdinoHeaderProps extends IVisynHeaderProps {
  tabs?: ITab[];
}

export function OrdinoHeader({ tabs, extensions }: IOrdinoHeaderProps) {
  const app = useAppSelector((state) => state.app);
  const workbenchLength = useAppSelector((state) => state.ordinoTracked.workbenches.length);
  const menu = useAppSelector((state) => state.menu);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // opening first ranking --> close start menu
    if (workbenchLength === 1) {
      dispatch(setMode(EStartMenuMode.OVERLAY));
      dispatch(setActiveTab(null));
    }
  }, [workbenchLength, dispatch]);

  React.useEffect(() => {
    if (workbenchLength === 0) {
      dispatch(setActiveTab(tabs[0].id));
    }
  }, [workbenchLength, dispatch, tabs]);

  const MemoizedLoginLink = React.useCallback(() => <VisynLoginLink userName={user.userName} onLogout={LoginUtils.logout} />, [user.userName]);
  const MemoizedHeaderTabs = React.useCallback(
    () => <HeaderTabs tabs={tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />,
    [menu.activeTab, tabs],
  );
  return (
    <>
      <VisynHeader
        extensions={{
          LeftExtensions: MemoizedHeaderTabs,
          RightExtensions: MemoizedLoginLink,
          ...extensions,
        }}
      />
      {app.ready ? <StartMenuTabWrapper tabs={tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} /> : null}
    </>
  );
}
