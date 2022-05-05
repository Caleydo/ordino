import * as React from 'react';
import { IDType, isVisynDataViewDesc, isVisynSimpleViewDesc, useAsync, ViewUtils } from 'tdp_core';
import { MosaicBranch } from 'react-mosaic-component';
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
  dragMode,
  path,
  setMosaicDrag,
}: {
  workbenchIndex: number;
  view: IWorkbenchView;
  dragMode: boolean;
  path: MosaicBranch[];
  setMosaicDrag: (b: boolean) => void;
}) {
  const ordino = useAppSelector((state) => state.ordino);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const views = useMemo(() => () => getVisynView(ordino.workbenches[workbenchIndex].entityId), []);
  const { value } = useAsync(views, []);

  const availableViews = useMemo(() => {
    return value ? value.filter((v) => isVisynSimpleViewDesc(v) || isVisynDataViewDesc(v)) : [];
  }, [value]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {view.id === '' ? (
        <WorkbenchEmptyView
          setMosaicDrag={setMosaicDrag}
          path={path}
          chooserOptions={availableViews}
          workbenchIndex={workbenchIndex}
          view={view}
          dragMode={dragMode}
        />
      ) : (
        <WorkbenchGenericView
          setMosaicDrag={setMosaicDrag}
          path={path}
          chooserOptions={availableViews}
          workbenchIndex={workbenchIndex}
          view={view}
          dragMode={dragMode}
        />
      )}
    </>
  );
}
