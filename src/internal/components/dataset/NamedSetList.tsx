import {I18nextManager, UserSession} from 'phovea_core';
import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ENamedSetType, FormDialog, INamedSet, IStoredNamedSet, NotificationHandler, RestStorageUtils, StoreUtils} from 'tdp_core';
import {ListItemDropdown} from '../common';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  value: INamedSet[] | null;
  onOpen: (event: React.MouseEvent<HTMLElement>, namedSet: INamedSet) => void;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export function NamedSetList({headerIcon, headerText, value, status, onOpen}: INamedSetListProps) {
  const [namedSets, setNamedSets] = React.useState<INamedSet[]>([]);
  React.useEffect(() => {
    setNamedSets(value);
  });

  const editNamedSet = (event: React.MouseEvent<DropdownItemProps>, namedSet: IStoredNamedSet) => {
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

  const deleteNamedSet = async (event: React.MouseEvent<DropdownItemProps>, namedSet: IStoredNamedSet) => {
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
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'pending' &&
        <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
      }
      {status === 'success' &&
        value.length === 0 &&
        <p>No sets available</p>
      }
      {status === 'success' &&
        value.length > 0 &&
        <ButtonGroup vertical>
          {namedSets.map((namedSet, i) => {
            const canWrite = namedSet.type === ENamedSetType.NAMEDSET && UserSession.getInstance().canWrite(namedSet);
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" onClick={(event) => onOpen(event, namedSet)} >{namedSet.name}</Button>
                {canWrite ?
                  <ListItemDropdown>
                    <Dropdown.Item onClick={(event) => editNamedSet(event, namedSet as IStoredNamedSet)}>Edit</Dropdown.Item>
                    <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteNamedSet(event, namedSet as IStoredNamedSet)}>Delete</Dropdown.Item>
                  </ListItemDropdown> : null
                }
              </ButtonGroup>);
          })}
        </ButtonGroup>
      }
      {/* {status === 'error' && <p>{(typeof error === 'string') ? error : (error as Error)?.message}</p>} */}
      {status === 'error' && <p>Error when loading sets</p>}
    </Col>
  );
}
