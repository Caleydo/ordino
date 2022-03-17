import * as React from 'react';
import { IDType, isVisynDataViewDesc, isVisynSimpleViewDesc, useAsync, ViewUtils } from 'tdp_core';
import { useMemo } from 'react';
import { IWorkbenchView } from '../../store';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';

export interface IWorkbenchSingleViewProps {
  workbenchIndex: number;
  view: IWorkbenchView;
}

export function getVisynView(entityId: string) {
  return ViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}

export function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps) {
  const ordino = useAppSelector((state) => state.ordino);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const views = useMemo(() => () => getVisynView(ordino.workbenches[workbenchIndex].entityId), []);
  const { value } = useAsync(views, []);

  const availableViews = useMemo(() => {
    return value ? value.filter((v) => isVisynSimpleViewDesc(v) || isVisynDataViewDesc(v)) : []; // TODO: maybe remove this when we have view subtypes in visyn views
  }, [value]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {view.id === '' ? (
        <WorkbenchEmptyView chooserOptions={availableViews} workbenchIndex={workbenchIndex} view={view} />
      ) : (
        <WorkbenchGenericView chooserOptions={availableViews} workbenchIndex={workbenchIndex} view={view} />
      )}
    </>
  );
}
