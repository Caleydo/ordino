import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {ENamedSetType, FormDialog, INamedSet, IStoredNamedSet, NotificationHandler, RestStorageUtils, StoreUtils} from 'tdp_core';
import {SESSION_KEY_NEW_ENTRY_POINT} from '../..';
import {ListItemDropdown} from '../common';
import {GraphContext} from '../../OrdinoAppComponent';
import {I18nextManager, UserSession} from 'phovea_core';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  value: INamedSet[] | null;
  startViewId: string;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export function NamedSetList({headerIcon, headerText, value, startViewId, status}: INamedSetListProps) {
  const {manager} = React.useContext(GraphContext);
  const [namedSets, setNamedSets] = React.useState<INamedSet[]>(null)
  React.useEffect(() => {
    setNamedSets(value)
  })

  // TODO: refactor init session handling
  const startAnalyis = (event: React.MouseEvent<HTMLElement, MouseEvent>, namedSet: INamedSet) => {
    event.preventDefault();
    const defaultSessionValues = {
      ['species']: 'human' // TODO: refactor to get the value as props
    };

    UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
      view: startViewId,
      options: {namedSet},
      defaultSessionValues
    });
    manager.newGraph();
  };

  const editNamedSet = (event: React.MouseEvent<DropdownItemProps>, namedSet: IStoredNamedSet) => {
    event.preventDefault()
    StoreUtils.editDialog(namedSet, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, sec) => {
      const params = Object.assign({
        name,
        description
      }, sec);

      const editedSet = await RestStorageUtils.editNamedSet(namedSet.id, params);

      // TODO: is the notification necessary?
      NotificationHandler.successfullySaved(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.namedSet'), name);
      setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1, editedSet))
    });
  }

  const deleteNamedSet = async (event: React.MouseEvent<DropdownItemProps>, namedSet: IStoredNamedSet) => {
    event.preventDefault()
    const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dialogText', {name: namedSet.name}),
      {title: I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.deleteSet')}
    );
    if (deleteIt) {
      await RestStorageUtils.deleteNamedSet(namedSet.id);
      NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dashboard'), namedSet.name);
      setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1))
    }
  }

  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'pending' &&
        <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
      }
      {status === 'success' &&
        namedSets.length === 0 &&
        <p>No sets available</p>
      }
      {status === 'success' &&
        namedSets.length > 0 &&
        <ButtonGroup vertical>
          {namedSets.map((namedSet, i) => {
            const canWrite = namedSet.type === ENamedSetType.NAMEDSET && UserSession.getInstance().canWrite(namedSet)
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" onClick={(event) => startAnalyis(event, namedSet)} >{namedSet.name}</Button>
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
