/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { useMemo } from 'react';
import { IWorkbenchView } from '../../store';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';

export interface IWorkbenchSingleViewProps {
  workbenchIndex: number;
  view: IWorkbenchView;
}

export function getVisynView(entityId: string) {
  return FindViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}

export function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps) {
  const ordino = useAppSelector((state) => state.ordino);

  const { value } = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);

  const availableViews = useMemo(() => {
    return value ? value.map((v) => v.v) : [];
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
