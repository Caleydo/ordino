import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { EStartMenuMode, setActiveTab, setMode } from '../store';
import { IVisynHeaderProps, VisynHeader } from '../visyn';
import { HeaderTabs } from './header/HeaderTabs';
import { ITab, StartMenuTabWrapper } from './header/StartMenuTabWrapper';

export interface IOrdinoHeaderProps extends IVisynHeaderProps {
  tabs?: ITab[];
}

export function OrdinoHeader(props: IOrdinoHeaderProps) {
  const app = useAppSelector((state) => state.app);
  const ordino = useAppSelector((state) => state.ordino);
  const menu = useAppSelector((state) => state.menu);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // opening first ranking --> close start menu
    if (ordino.workbenches.length === 1) {
      dispatch(setMode(EStartMenuMode.OVERLAY));
      dispatch(setActiveTab(null));
    }
  }, [ordino.workbenches.length, dispatch]);

  React.useEffect(() => {
    if (ordino.workbenches.length === 0) {
      dispatch(setActiveTab(props.tabs[0].id));
    }
  }, [ordino.workbenches.length, dispatch, props.tabs]);

  return (
    <>
      <VisynHeader
        extensions={{
          // eslint-disable-next-line react/no-unstable-nested-components
          LeftExtensions: () => <HeaderTabs tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />,
          ...props.extensions,
        }}
      />
      {app.ready ? <StartMenuTabWrapper tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} /> : null}
    </>
  );
}
