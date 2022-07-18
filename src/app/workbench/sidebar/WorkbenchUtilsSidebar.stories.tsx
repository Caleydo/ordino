import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { addFirstWorkbench, setColorMap, store } from '../../../store';
import { WorkbenchUtilsSidebar } from './WorkbenchUtilsSidebar';
import { EWorkbenchDirection } from '../../../store/interfaces';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

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
  store.dispatch(
    setColorMap({
      colorMap: { test: 'cornflowerblue' },
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
            name: 'test',
            id: 'test',
            parameters: { prevSelection: [], selectedMappings: {} },
            uniqueId: (Math.random() + 1).toString(36).substring(7),
            filters: [],
          },
        ],
        selection: [],
        columnDescs: [],
        entityId: 'test',
        name: 'Cell Line',
        viewDirection: EWorkbenchDirection.VERTICAL,
      },
      globalQuery: null,
      appliedQueryFilter: null,
    }),
  );

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
      <WorkbenchUtilsSidebar {...args} />{' '}
    </div>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Mapping = Template.bind({}) as typeof Template;
Mapping.parameters = {
  msw: {
    handlers: [
      rest.get('/api/idtype/test', (req, res, ctx) => {
        console.log('im in here');
        return res(ctx.json(['22Rv1']));
      }),
    ],
  },
};

Mapping.args = {
  openTab: null,
  workbench: {
    itemIDType: 'test',
    detailsSidebarOpen: true,
    createNextWorkbenchSidebarOpen: false,
    selectedMappings: [{ entityId: 'test', columnSelection: 'test' }],
    views: [
      {
        name: 'test',
        id: 'test',
        parameters: { prevSelection: [], selectedMappings: {} },
        uniqueId: (Math.random() + 1).toString(36).substring(7),
        filters: [],
      },
    ],
    viewDirection: EWorkbenchDirection.VERTICAL,
    columnDescs: [],
    data: {},
    entityId: 'test',
    name: 'Cell Line',
    index: 1,
    selection: [],
  },
};
