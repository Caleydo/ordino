import React, { useMemo } from 'react';
import { PluginRegistry, UniqueIdManager, useAsync } from 'tdp_core';
import { BrowserRouter } from 'react-router-dom';

import { EP_ORDINO_STARTMENU_SESSION_SECTION, IStartMenuSessionSectionDesc } from '../../../base/extensions';
import { OrdinoScrollspy, OrdinoScrollspyItem } from '../../components';
import { OrdinoFooter } from '../../../components';

import type { IStartMenuTabProps } from '../../interfaces';

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

export default function SessionsTab(_props: IStartMenuTabProps) {
  const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  const loadSections = useMemo(
    () => () => {
      const sectionEntries = PluginRegistry.getInstance()
        .listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION)
        .map((d) => d as IStartMenuSessionSectionDesc)
        .sort(byPriority);
      return Promise.all(sectionEntries.map((section) => section.load()));
    },
    [],
  );

  const { status, value: items } = useAsync(loadSections, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {status === 'success' ? (
        <OrdinoScrollspy items={items.map((item) => ({ id: `${item.desc.id}_${suffix}`, name: item.desc.name }))}>
          {(handleOnChange) => (
            <>
              <div className="container pb-10 pt-5">
                <div className="row justify-content-center">
                  <div className="col-11 position-relative">
                    {items?.map((item, index) => {
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
                <OrdinoFooter openInNewWindow />
              </BrowserRouter>
            </>
          )}
        </OrdinoScrollspy>
      ) : null}
    </>
  );
}
