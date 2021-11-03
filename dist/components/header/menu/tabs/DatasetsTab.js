import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter, OrdinoScrollspy, OrdinoScrollspyItem } from '../../..';
import DataLandscapeCard from 'reprovisyn/dist/views/DataLandscapeCard';
import EntitySelectionCard from 'reprovisyn/dist/views/EntitySelectionCard';
export default function DatasetsTab({ extensions: { preExtensions = null, postExtensions = null, dataLandscape = React.createElement(DataLandscapeCard, null), entityRelation = React.createElement(EntitySelectionCard, null) } = {} }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(OrdinoScrollspy, { items: [{ id: `dataLandScapeCard`, name: `Data Landscape` }, { id: `entitySelectionCard`, name: `Entity Selection` }] }, (handleOnChange) => React.createElement(React.Fragment, null,
            React.createElement("div", { className: "container pb-10 pt-5" },
                React.createElement("div", { className: "row justify-content-center" },
                    React.createElement("div", { className: "col-11 position-relative" },
                        React.createElement("p", { className: "lead text-gray-600 mb-0" }, "Start a new analysis session by loading a dataset"),
                        preExtensions,
                        React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: `dataLandScapeCard`, key: 'dataLandscapeCard', index: 0, handleOnChange: handleOnChange }, dataLandscape),
                        React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: `entitySelectionCard`, key: 'entitySelectionCard', index: 1, handleOnChange: handleOnChange }, entityRelation),
                        postExtensions))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true }))))));
}
//# sourceMappingURL=DatasetsTab.js.map