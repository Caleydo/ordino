import React, { useMemo } from 'react';
import { PluginRegistry } from 'visyn_core/plugin';
import { useAsync } from 'visyn_core/hooks';
import { I18nextManager } from 'visyn_core/i18n';
import { UniqueIdManager } from 'tdp_core';
import { BrowserRouter } from 'react-router-dom';

import { OrdinoScrollspy, OrdinoScrollspyItem } from '../../components';
import { EP_ORDINO_STARTMENU_DATASET_SECTION, IStartMenuDatasetSectionDesc } from '../../../base/extensions';
import { OrdinoFooter } from '../../../components';

import type { IStartMenuTabProps } from '../../interfaces';

export default function DatasetsTab(_props: IStartMenuTabProps) {
  const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  const loadCards = useMemo(
    () => () => {
      const sectionEntries = PluginRegistry.getInstance()
        .listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION)
        .map((d) => d as IStartMenuDatasetSectionDesc);
      return Promise.all(sectionEntries.map((section) => section.load()));
    },
    [],
  );

  const { status, value: items } = useAsync(loadCards, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {status === 'success' ? (
        <OrdinoScrollspy items={items.map((card) => ({ id: `${card.desc.id}_${suffix}`, name: card.desc.name }))}>
          {(handleOnChange) => (
            <>
              <div className="container pb-10 pt-5">
                <div className="row justify-content-center">
                  <div className="col-11 position-relative" data-testid="datasets-tab">
                    <p className="lead text-gray-600 mb-0"> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.datasetTabInfo')}</p>
                    {items.map((item, index) => {
                      return (
                        // `id` attribute must match the one in the scrollspy
                        <OrdinoScrollspyItem
                          className="pt-3 pb-5"
                          id={`${item.desc.id}_${suffix}`}
                          key={item.desc.id}
                          index={index}
                          handleOnChange={handleOnChange}
                        >
                          <item.factory {...item.desc} />
                        </OrdinoScrollspyItem>
                      );
                    })}
                  </div>
                </div>
              </div>
              <BrowserRouter basename="/#">
                <OrdinoFooter openInNewWindow testId="datasets-tab" />
              </BrowserRouter>
            </>
          )}
        </OrdinoScrollspy>
      ) : null}
    </>
  );
}
