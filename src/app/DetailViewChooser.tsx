import * as React from "react";
import { UniqueIdManager } from "phovea_core";
import { DetailViewFilter } from "./chooser/DetailViewFilter";
import { SelectedViewIndicator } from "./chooser/SelectedViewIndicator";
import { BurgerMenu } from "./chooser/BurgerMenu";
import { SelectionCountIndicator } from "./chooser/SelectionCountIndicator";
import { EViewMode, IViewPluginDesc } from "tdp_core";
import { groupBy } from "lodash";

export interface IViewGroupDesc {
  name: string;
  items: IViewPluginDesc[];
}

interface IDetailViewChooserProps {
  index: number;
  embedded: boolean;
  setEmbedded: (b: boolean) => void;
  views: IViewPluginDesc[];
  selectedView: IViewPluginDesc;
  onSelectedView: (view: IViewPluginDesc, viewIndex: number) => void;
}

export function DetailViewChooser(props: IDetailViewChooserProps) {
  // TODO bootstrap js not working
  // TODO split into smaller components
  const [filteredViews, setFilteredViews] = React.useState<IViewPluginDesc[] | []>(props.views);
  const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
  const groupedViews = groupBy(filteredViews, (view) => view.group.name);

  console.log("rerendering");
  return (
    <>
      <div
        className={`detail-view-chooser d-flex flex-column m-1 border border-gray ${
          props.embedded ? "embedded" : "overlay"
        }`}
      >
        <header className="d-flex my-2 px-2 justify-content-center align-items-center">
          <BurgerMenu onClick={() => props.setEmbedded(!props.embedded)} />
          <DetailViewFilter views={props.views} setFilteredViews={setFilteredViews} />
        </header>

        {!props.embedded && (
          <main className="selected-view-wrapper mt-2 d-flex flex-column justify-content-center align-items-center">
            <SelectionCountIndicator selectionCount={5} viewMode={EViewMode.FOCUS} idType="Cellines" />
            <SelectedViewIndicator
              selectedView={props.selectedView?.name}
              availableViews={props.views.length}
            />
          </main>
        )}

        <main className="view-buttons flex-row overflow-auto border-top border-gray">
          <div className="accordion">
            {Object.keys(groupedViews).map((v, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header" id={v}>
                  <button
                    className="accordion-button btn-text-gray"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${i}-${uniqueSuffix}`}
                    aria-expanded="true"
                    aria-controls={`collapse-${i}-${uniqueSuffix}`}
                  >
                    {v}
                  </button>
                </h2>
                <div
                  id={`collapse-${i}-${uniqueSuffix}`}
                  className="accordion-collapse collapse show"
                  aria-labelledby={v}
                >
                  <div className="accordion-body d-grid gap-2">
                    {groupedViews[v].map((view, idx) => (
                      <button
                        className="btn btn-text-gray text-start"
                        key={idx}
                        onClick={() => props.onSelectedView(view, props.index)}
                      >
                        {view.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
