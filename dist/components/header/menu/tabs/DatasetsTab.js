// import React, {useMemo} from 'react';
// import {BrowserRouter} from 'react-router-dom';
// import {OrdinoFooter, OrdinoScrollspy, OrdinoScrollspyItem} from '../../..';
// import DataLandscapeCard from 'reprovisyn/dist/views/DataLandscapeCard';
// import EntitySelectionCard from 'reprovisyn';
import { UniqueIdManager } from "phovea_core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { OrdinoScrollspy, OrdinoScrollspyItem, OrdinoFooter } from "../../..";
import DataLandscapeCard from "../../../../../../reprovisyn/dist/views/DataLandscapeCard";
import EntitySelectionCard from "../../../../../../reprovisyn/dist/views/EntitySelectionCard";
// export interface IDatasetsTabProps {
//   extensions?: {
//     preExtensions?: React.ReactElement | null;
//     postExtensions?: React.ReactElement | null;
//     dataLandscape?: React.ReactElement | null;
//     entityRelation?: React.ReactElement | null;
//   };
// }
// export function DatasetsTab({
//   extensions: {
//     preExtensions = null,
//     postExtensions = null,
//     dataLandscape = <DataLandscapeCard/>,
//     entityRelation = <EntitySelectionCard/>
//   } = {}
// }: IDatasetsTabProps) {
//   return (
//     <>
//         {/* TODO: Figure out how to dynamically add the extensions here */}
//         <OrdinoScrollspy items={[{id: `dataLandScapeCard`, name: `Data Landscape`}, {id: `entitySelectionCard`, name: `Entity Selection`}]}>
//           {(handleOnChange) =>
//             <>
//               <div className="container pb-10 pt-5">
//                 <div className="row justify-content-center">
//                   <div className="col-11 position-relative">
//                     <p className="lead text-gray-600 mb-0">Start a new analysis session by loading a dataset</p>
//                       {preExtensions}
//                         <OrdinoScrollspyItem className="pt-3 pb-5" id={`dataLandScapeCard`} key={'dataLandscapeCard'} index={0} handleOnChange={handleOnChange}>
//                           {dataLandscape}
//                         </OrdinoScrollspyItem>
//                         <OrdinoScrollspyItem className="pt-3 pb-5" id={`entitySelectionCard`} key={'entitySelectionCard'} index={1} handleOnChange={handleOnChange}>
//                           {entityRelation}
//                         </OrdinoScrollspyItem>
//                         {postExtensions}
//                   </div>
//                 </div>
//               </div>
//               <BrowserRouter basename="/#">
//                 <OrdinoFooter openInNewWindow />
//               </BrowserRouter>
//             </>
//           }
//         </OrdinoScrollspy>
//     </>
//   );
// }
const datasets = [
    {
        id: 'dataLandScapeCard',
        name: `Data Landscape`,
        Card: DataLandscapeCard
    },
    {
        id: 'entitySelectionCard',
        name: `Entity Selection`,
        Card: EntitySelectionCard
    },
];
export function DatasetsTab() {
    const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(OrdinoScrollspy, { items: datasets }, (handleOnChange) => React.createElement(React.Fragment, null,
            React.createElement("div", { className: "container pb-10 pt-5" },
                React.createElement("div", { className: "row justify-content-center" },
                    React.createElement("div", { className: "col-11 position-relative" },
                        React.createElement("p", { className: "lead text-gray-600 mb-0" }, "Start a new analysis session by loading a dataset"),
                        datasets.map(({ id, Card }, index) => {
                            return (React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: id, key: id, index: index, handleOnChange: handleOnChange },
                                React.createElement(Card, null)));
                        })))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true }))))));
}
//# sourceMappingURL=DatasetsTab.js.map