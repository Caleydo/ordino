import React, {useMemo} from 'react';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {EP_ORDINO_STARTMENU_DATASET_SECTION, IStartMenuDatasetSectionDesc} from '../../../..';
import {useAsync} from '../../../../hooks';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter, OrdinoScrollspy, OrdinoScrollspyItem} from '../../..';
import DataLandscapeCard from 'reprovisyn/dist/views/DataLandscapeCard';
import EntitySelectionCard from 'reprovisyn/dist/views/EntitySelectionCard';
import {handleInputChange} from 'react-select/src/utils';

export interface IDatasetsTabProps {
  extensions?: {
    preExtensions?: React.ReactElement | null;
    postExtensions?: React.ReactElement | null;
    dataLandscape?: React.ReactElement | null;
    entityRelation?: React.ReactElement | null;
  };
}

export default function DatasetsTab({
  extensions: {
    preExtensions = null,
    postExtensions = null,
    dataLandscape = <DataLandscapeCard/>,
    entityRelation = <EntitySelectionCard/>
  } = {}
}: IDatasetsTabProps) {
  return (
    <>
        <OrdinoScrollspy items={[{id: `dataLandScapeCard`, name: `Data Landscape`}, {id: `entitySelectionCard`, name: `Entity Selection`}]}>
          {(handleOnChange) =>
            <>
              <div className="container pb-10 pt-5">
                <div className="row justify-content-center">
                  <div className="col-11 position-relative">
                    <p className="lead text-gray-600 mb-0">Start a new analysis session by loading a dataset</p>
                        <OrdinoScrollspyItem className="pt-3 pb-5" id={`dataLandScapeCard`} key={'dataLandscapeCard'} index={0} handleOnChange={handleOnChange}>
                          {dataLandscape}
                        </OrdinoScrollspyItem>
                        <OrdinoScrollspyItem className="pt-3 pb-5" id={`entitySelectionCard`} key={'entitySelectionCard'} index={1} handleOnChange={handleOnChange}>
                          {entityRelation}
                        </OrdinoScrollspyItem>
                  </div>
                </div>
              </div>
              <BrowserRouter basename="/#">
                <OrdinoFooter openInNewWindow />
              </BrowserRouter>
            </>
          }
        </OrdinoScrollspy>
    </>
  );
}
