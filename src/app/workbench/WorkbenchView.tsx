import * as React from 'react';
import { IDType, useAsync, ViewUtils } from 'tdp_core';
import { MosaicBranch, MosaicPath } from 'react-mosaic-component';
import { useMemo } from 'react';
import { IWorkbenchView } from '../../store';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';

export function getVisynView(entityId: string) {
  return ViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}

export function WorkbenchView({
  workbenchIndex,
  view,
  mosaicDrag,
  path,
  removeCallback,
}: {
  workbenchIndex: number;
  view: IWorkbenchView;
  mosaicDrag: boolean;
  path: MosaicBranch[];
  removeCallback: (path: MosaicPath) => void;
}) {
  const ordino = useAppSelector((state) => state.ordino);
  const { value: visynViews } = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);

  const availableViews = useMemo(() => {
    return visynViews || [];
  }, [visynViews]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {view.id === '' ? (
        <WorkbenchEmptyView
          removeCallback={removeCallback}
          path={path}
          chooserOptions={availableViews}
          workbenchIndex={workbenchIndex}
          view={view}
          mosaicDrag={mosaicDrag}
        />
      ) : (
        <WorkbenchGenericView
          removeCallback={removeCallback}
          path={path}
          chooserOptions={availableViews}
          workbenchIndex={workbenchIndex}
          view={view}
          mosaicDrag={mosaicDrag}
        />
      )}
    </>
  );
}
