import React from 'react';
import {Button, ButtonGroup, Col, Dropdown, Row, } from 'react-bootstrap';
import {DatasetSearchBox} from './DatasetSearchBox';
import {useAsync} from '../../hooks';
import {INamedSet, IStoredNamedSet, ENamedSetType, RestBaseUtils, RestStorageUtils} from 'tdp_core';

interface IDatasetEntriesProps {
  headerIcon: string;
  headerText: string;
  loadEntries: () => Promise<IStoredNamedSet[] | INamedSet[]>;
  onclick?: () => null;
  readonly?: boolean;
}

function DatasetEntries({headerIcon, headerText, loadEntries, readonly}: IDatasetEntriesProps) {
  const { status, value, error } = useAsync<IStoredNamedSet[]>(loadEntries);

  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'success' &&
        <ButtonGroup vertical>
          {value.map((entry, i) => {
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" >{entry.name}</Button>
                { readonly ||
                  <DatasetEntryDropdown>
                    <Dropdown.Item >Edit</Dropdown.Item>
                    <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
                  </DatasetEntryDropdown>
                }
              </ButtonGroup>);
          })}
        </ButtonGroup>
      }
      {status === 'error' && <div>{error}</div>}
    </Col>
  );
}



interface IDatasetEntryDropdown {
  children?: React.ReactNode;
}

export function DatasetEntryDropdown(props: IDatasetEntryDropdown) {
  return (
    <Dropdown vertical className="session-dropdown" as={ButtonGroup}>
      <Dropdown.Toggle variant="link"><i className="fas fa-ellipsis-v "></i></Dropdown.Toggle>
      <Dropdown.Menu>
        {props.children}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export function DatasetSection({species, idType, database, dbViewBase}) {
  const subTypeKey = 'species';

  function loadPredefinedSet() {
    return RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
    .then((panels: { id: string, description: string, species: string }[]) => {
      return panels
        .filter((panel) => panel.species === species)
        .map(function panel2NamedSet({id, description, species}): INamedSet {
          return {
          type: ENamedSetType.PANEL,
          id,
          name: id,
          description,
          subTypeKey,
          subTypeFromSession: false,
          subTypeValue: species,
          idType: ''
          };
        });
    });
  }

  function loadNamedSets() {
    return RestStorageUtils.listNamedSets(idType)
      .then((namedSets: IStoredNamedSet[]) => {
        return namedSets.filter((namedSet) => namedSet.subTypeKey === subTypeKey && namedSet.subTypeValue === species);
      });
  }

  return (
    <>
      <DatasetSearchBox></DatasetSearchBox>
      <Row className="mt-4">
        <DatasetEntries headerIcon="fas fa-database" headerText="Predefined Sets" loadEntries={loadPredefinedSet} readonly />
        <DatasetEntries headerIcon="fas fa-user" headerText="My Sets" loadEntries={loadNamedSets} />
        <DatasetEntries headerIcon="fas fa-users" headerText="Public Sets" loadEntries={loadNamedSets} readonly />
      </Row>
    </>
  );
}
