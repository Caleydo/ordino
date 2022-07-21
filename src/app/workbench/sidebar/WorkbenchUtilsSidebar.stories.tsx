import React, { useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { I18nextManager, IDTypeManager, PluginRegistry, useAsync, ViewUtils } from 'tdp_core';
import { addFirstWorkbench, addWorkbench, changeFocus, setColorMap, store } from '../../../store';
import { WorkbenchUtilsSidebar } from './WorkbenchUtilsSidebar';
import { EWorkbenchDirection } from '../../../store/interfaces';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { findWorkbenchTransitions } from '../../../views/interfaces';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WorkbenchUtilsSidebar',
  component: WorkbenchUtilsSidebar,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WorkbenchUtilsSidebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/function-component-definition
const Template: ComponentStory<typeof WorkbenchUtilsSidebar> = (args) => {
  useEffect(() => {
    PluginRegistry.getInstance().pushVisynView<any>('test1', () => null, {
      // omit `load` function because they added automatically in `PluginRegistry.push()`
      visynViewType: 'ranking',
      idtype: 'test2', // input idtype from previous ranking (used by detail view chooser)
      itemIDType: 'test1', // own idtype for current ranking
      name: 'test1',
      selection: 'any',
      relation: 'test1',
      group: {
        name: I18nextManager.getInstance().i18n.t('reprovisyn:proxyViews.workbenchTransition'), // group views by target entity
        order: 10, // TODO define and load order from reprovisyn config
      },
      icon: 'fas fa-table',
    });

    PluginRegistry.getInstance().pushVisynView<any>('test2', () => null, {
      // omit `load` function because they added automatically in `PluginRegistry.push()`
      visynViewType: 'ranking',
      idtype: 'test1', // input idtype from previous ranking (used by detail view chooser)
      itemIDType: 'test2', // own idtype for current ranking
      name: 'test2',
      selection: 'any',
      relation: {
        mapping: [
          {
            name: 'Name',
            entity: 'test2',
            columns: [{ label: 'Column1' }, { label: 'Column2' }],
          },
        ],
      },
      group: {
        name: I18nextManager.getInstance().i18n.t('reprovisyn:proxyViews.workbenchTransition'), // group views by target entity
        order: 10, // TODO define and load order from reprovisyn config
      },
      icon: 'fas fa-table',
    });
  }, []);

  const { status, value: availableViews } = useAsync(ViewUtils.findVisynViews, [IDTypeManager.getInstance().resolveIdType('test1')]);

  console.log(status, availableViews);

  store.dispatch(
    setColorMap({
      colorMap: { test2: 'cornflowerblue', test1: 'lightgray' },
    }),
  );

  store.dispatch(
    addFirstWorkbench({
      workbench: {
        itemIDType: 'test1',
        detailsSidebarOpen: false,
        createNextWorkbenchSidebarOpen: false,
        selectedMappings: [],
        commentsOpen: false,
        index: 0,
        data: {},
        views: [
          {
            name: 'test1',
            id: 'test1',
            parameters: { prevSelection: [], selectedMappings: {} },
            uniqueId: (Math.random() + 1).toString(36).substring(7),
            filters: [],
          },
        ],
        selection: ['22Rv1', '45923'],
        columnDescs: [],
        entityId: 'test1',
        name: 'Cell Line',
        viewDirection: EWorkbenchDirection.VERTICAL,
      },
      globalQuery: null,
      appliedQueryFilter: null,
    }),
  );

  store.dispatch(
    addWorkbench({
      itemIDType: 'test1',
      detailsSidebarOpen: false,
      createNextWorkbenchSidebarOpen: false,
      selectedMappings: [],
      commentsOpen: false,
      index: 1,
      data: {},
      views: [
        {
          name: 'test2',
          id: 'test2',
          parameters: { prevSelection: [], selectedMappings: {} },
          uniqueId: (Math.random() + 1).toString(36).substring(7),
          filters: [],
        },
      ],
      selection: [],
      columnDescs: [],
      entityId: 'test2',
      name: 'Cell Line',
      viewDirection: EWorkbenchDirection.VERTICAL,
    }),
  );

  store.dispatch(changeFocus({ index: 1 }));

  console.log('hello');

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
      {store.getState().ordino.workbenches.length > 0 ? <WorkbenchUtilsSidebar openTab={null} workbench={store.getState().ordino.workbenches[1]} /> : null}
    </div>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Mapping = Template.bind({}) as typeof Template;
Mapping.parameters = {
  msw: {
    handlers: [
      rest.get('/api/idtype/test1', (req, res, ctx) => {
        console.log('im in here');
        return res(ctx.json([]));
      }),
    ],
  },
};
