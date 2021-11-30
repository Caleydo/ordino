import {I18nextManager, UserSession} from 'tdp_core';
import React from 'react';
import {ENamedSetType, FormDialog, INamedSet, IStoredNamedSet, NotificationHandler, RestStorageUtils, StoreUtils} from 'tdp_core';
import {ListItemDropdown} from '../../../components';
import {DatasetUtils} from './DatasetUtils';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  value: INamedSet[] | null;
  onOpen: (event: React.MouseEvent<HTMLElement>, namedSet: INamedSet) => void;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export function NamedSetList({headerIcon, headerText, value, status, onOpen}: INamedSetListProps) {
  const testId = headerText.replace(/\s+/g, '-').toLowerCase(); //replace whtiespace by dash and make lowercase
  const [namedSets, setNamedSets] = React.useState<INamedSet[]>([]);
  React.useEffect(() => {
    setNamedSets(value);
  });

  const editNamedSet = (event: React.MouseEvent, namedSet: IStoredNamedSet) => {
    event.preventDefault();
    StoreUtils.editDialog(namedSet, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, sec) => {
      const params = Object.assign({
        name,
        description
      }, sec);

      const editedSet = await RestStorageUtils.editNamedSet(namedSet.id, params);

      NotificationHandler.successfullySaved(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.namedSet'), name);
      setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1, editedSet));
    });
  };

  const deleteNamedSet = async (event: React.MouseEvent, namedSet: IStoredNamedSet) => {
    event.preventDefault();
    const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dialogText', {name: namedSet.name}),
      {title: I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.deleteSet')}
    );
    if (deleteIt) {
      await RestStorageUtils.deleteNamedSet(namedSet.id);
      NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dashboard'), namedSet.name);
      setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1));
    }
  };

  return (
    <div className="dataset-entry d-flex flex-column col-md-4 position-relative" data-testid={testId}>
      <header><i className={`ms-1 me-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'pending' &&
        <p className="p-1"><i className="fas fa-circle-notch fa-spin"></i> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')} </p>
      }
      {status === 'success' &&
        value.length === 0 &&
        <p className="p-1">{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')}</p>
      }
      {status === 'success' &&
        value.length > 0 &&
        <div role="group" className="dataset-entry-item btn-group-vertical justify-content-start position-static p-1">
          {namedSets.map((namedSet, i) => {
            const canWrite = namedSet.type === ENamedSetType.NAMEDSET && UserSession.getInstance().canWrite(namedSet);
            return (
              <div key={i} className="dropdown-parent justify-content-between btn-group position-static">
                <button className="text-start ps-0 btn btn-link text-ordino-button-primary" data-testid={`${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`} title={DatasetUtils.toNamedSetTitle(namedSet)} onClick={(event) => onOpen(event, namedSet)} >{namedSet.name}</button>
                {canWrite ?
                  <ListItemDropdown>
                    <button className="dropdown-item" data-testid={`${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`} title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.editDatasetDetails')} onClick={(event) => editNamedSet(event, namedSet as IStoredNamedSet)}>
                      {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.edit')}
                    </button>
                    <button className="dropdown-item dropdown-delete" data-testid={`${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`} title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')} onClick={(event) => deleteNamedSet(event, namedSet as IStoredNamedSet)}>
                      {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')}
                    </button>
                  </ListItemDropdown> : null
                }
              </div>);
          })}
        </div>
      }
      {/* {status === 'error' && <p>{(typeof error === 'string') ? error : (error as Error)?.message}</p>} */}
      {status === 'error' && <p> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')}</p>}
    </div>
  );
}
