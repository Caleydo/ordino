import React from 'react';
import {IRankingProps} from '.';
import {Column, createLocalDataProvider, defaultOptions, EngineRenderer, IColumnDesc, IGroupData, IGroupItem, IGroupSearchItem, IRule, isGroup, ITaggleOptions, LocalDataProvider, spaceFillingRule, TaggleRenderer, updateLodRules} from 'lineupjs'
import {AView, BaseUtils, ColumnDescUtils, ErrorAlertHandler, GeneralVisWrapper, I18nextManager, IARankingViewOptions, IContext, IDType, IDTypeManager, IScoreRow, ISearchOption, ISecureItem, ISelection, ISelectionColumn, LazyColumn, LineUpColors, LineUpPanelActions, LineupUtils, NotificationHandler, RestStorageUtils, SelectionUtils, useAsync, useSyncedRef, ViewUtils} from 'tdp_core';
import {LineUpSelectionHelper, Range} from 'tdp_core';

const defaults = {
    itemName: 'item',
    itemNamePlural: 'items',
    itemRowHeight: null,
    itemIDType: null,
    additionalScoreParameter: null,
    additionalComputeScoreParameter: null,
    subType: {key: '', value: ''},
    enableOverviewMode: true,
    enableZoom: true,
    enableCustomVis: true,
    enableDownload: true,
    enableSaveRanking: true,
    enableAddingColumns: true,
    enableAddingColumnGrouping: false,
    enableAddingSupportColumns: true,
    enableAddingCombiningColumns: true,
    enableAddingScoreColumns: true,
    enableAddingPreviousColumns: true,
    enableAddingDatabaseColumns: true,
    databaseColumnGroups: {},
    enableAddingMetaDataColumns: true,
    enableSidePanelCollapsing: true,
    enableSidePanel: 'collapsed',
    enableHeaderSummary: true,
    enableStripedBackground: false,
    enableHeaderRotation: false,
    customOptions: {},
    customProviderOptions: {
        maxNestedSortingCriteria: Infinity,
        maxGroupColumns: Infinity,
        filterGlobally: true,
        propagateAggregationState: false
    },
    formatSearchBoxItem: (item: ISearchOption | IGroupSearchItem<ISearchOption>, node: HTMLElement): string | void => {
        // TypeScript type guard function
        function hasColumnDesc(item: ISearchOption | IGroupSearchItem<ISearchOption>): item is ISearchOption {
            return (item as ISearchOption).desc != null;
        }
        if (node.parentElement && hasColumnDesc(item)) {
            node.dataset.type = item.desc.type;
            const summary = item.desc.summary || item.desc.description;
            node.classList.toggle('lu-searchbox-summary-entry', Boolean(summary));
            if (summary) {
                const label = node.ownerDocument.createElement('span');
                label.textContent = item.desc.label;
                node.appendChild(label);
                const desc = node.ownerDocument.createElement('span');
                desc.textContent = summary;
                node.appendChild(desc);
                return undefined;
            }
        }
        return item.text;
    },
    panelAddColumnBtnOptions: {}
};

export function Ranking({
    data = [],
    selection,
    columnDesc = [],
    selectionAdapter = null,
    options: opts = {},
    onUpdateEntryPoint,
    onItemSelect,
    onItemSelectionChanged,
    onCustomizeRanking,
    onBuiltLineUp

}: IRankingProps) {
    // TODO: SCORES
    // TODO: CUSTOM SELECTION ADAPTER FOR DRILLDOWN
    // TODO: TDPTokenManager
    // TODO:
    const [busy, setBusy] = React.useState<boolean>(false);
    const options = BaseUtils.mixin({}, defaults, opts) as Readonly<IARankingViewOptions>;
    const itemSelections = new Map<string, ISelection>();
    itemSelections.set(AView.DEFAULT_SELECTION_NAME, {idtype: null, range: Range.none()});
    const itemIDType = (options.itemIDType ? IDTypeManager.getInstance().resolveIdType(options.itemIDType) : null);
    const viewRef = React.useRef<HTMLDivElement | null>(null);
    const lineupParentRef = React.useRef<HTMLDivElement | null>(null);

    const colorsRef = useSyncedRef(new LineUpColors());
    const providerRef = React.useRef<LocalDataProvider>(null);
    const taggleRef = React.useRef<EngineRenderer | TaggleRenderer>(null);
    const selectionHelperRef = React.useRef<LineUpSelectionHelper>(null);
    const panelRef = React.useRef<LineUpPanelActions>(null);
    const generalVisRef = React.useRef<GeneralVisWrapper>(null);


    const addColumn = (colDesc: any, data: Promise<IScoreRow<any>[]>, id = -1, position?: number) => {
        // use `colorMapping` as default; otherwise use `color`, which is deprecated; else get a new color
        colDesc.colorMapping = colDesc.colorMapping ? colDesc.colorMapping : (colDesc.color ? colDesc.color : colorsRef.current.getColumnColor(id));
        return LazyColumn.addLazyColumn(colDesc, data, providerRef.current, position, () => {
            taggleRef.current.update();
        });
    };

    const createContext = (): IContext => {
        const ranking = providerRef.current.getLastRanking();
        const columns = ranking ? ranking.flatColumns : [];
        return {
            columns,
            selection,
            freeColor: (id: number) => colorsRef.current.freeColumnColor(id),
            add: (columns: ISelectionColumn[]) => columns.forEach((col) => addColumn(col.desc, col.data, col.id, col.position)),
            remove: (columns: Column[]) => columns.forEach((c) => c.removeMe())
        };
    };

    const updatePanelChooser = BaseUtils.debounce(() => panelRef.current.updateChooser(itemIDType, providerRef.current.getColumns()), 100);

    React.useEffect(() => {
        if (lineupParentRef.current && viewRef.current && taggleRef.current == null) {
            providerRef.current = createLocalDataProvider([], [], options.customProviderOptions);
            providerRef.current.on(LocalDataProvider.EVENT_ORDER_CHANGED, () => null);

            const taggleOptions: ITaggleOptions = BaseUtils.mixin(defaultOptions(), options.customOptions, {
                summaryHeader: options.enableHeaderSummary,
                labelRotation: options.enableHeaderRotation ? 45 : 0
            } as Partial<ITaggleOptions>, options.customOptions);

            if (typeof options.itemRowHeight === 'number' && options.itemRowHeight > 0) {
                taggleOptions.rowHeight = options.itemRowHeight;
            } else if (typeof options.itemRowHeight === 'function') {
                const f = options.itemRowHeight;
                taggleOptions.dynamicHeight = () => ({
                    defaultHeight: taggleOptions.rowHeight,
                    padding: () => 0,
                    height: (item: IGroupItem | IGroupData) => {
                        return f(item) ?? (isGroup(item) ? taggleOptions.groupHeight : taggleOptions.rowHeight);
                    }
                });
            }

            taggleRef.current = !options.enableOverviewMode ? new EngineRenderer(providerRef.current, lineupParentRef.current, taggleOptions) : new TaggleRenderer(providerRef.current, lineupParentRef.current, Object.assign(taggleOptions, {
                violationChanged: (_: IRule, violation: string) => panelRef.current.setViolation(violation)
            }));

            if (viewRef.current && taggleRef.current) {
                const luBackdrop = viewRef.current.querySelector('.lu-backdrop');
                viewRef.current.appendChild(luBackdrop);
            }
            selectionHelperRef.current = new LineUpSelectionHelper(providerRef.current, () => itemIDType as IDType);

            panelRef.current = new LineUpPanelActions(providerRef.current, taggleRef.current.ctx, options, lineupParentRef.current.ownerDocument);

            // TODO: should we hardcode the generalVis since it is a separate view
            // generalVisRef=new GeneralVisWrapper(providerRef.current, this, this.selectionHelper, this.node.ownerDocument);

            // When a new column desc is added to the provider, update the panel chooser
            providerRef.current.on(LocalDataProvider.EVENT_ADD_DESC, updatePanelChooser);

            // TODO: Include this when the remove event is included: https://github.com/lineupjs/lineupjs/issues/338
            // providerRef.current.on(LocalDataProvider.EVENT_REMOVE_DESC, updatePanelChooser);
            panelRef.current.on(LineUpPanelActions.EVENT_SAVE_NAMED_SET, async (_event, order: number[], name: string, description: string, sec: Partial<ISecureItem>) => {
                const ids = selectionHelperRef.current.rowIdsAsSet(order);
                const namedSet = await RestStorageUtils.saveNamedSet(name, itemIDType, ids, options.subType, description, sec);
                NotificationHandler.successfullySaved(I18nextManager.getInstance().i18n.t('tdp:core.lineup.RankingView.successfullySaved'), name);
                onUpdateEntryPoint?.(namedSet);
            });

            panelRef.current.on(LineUpPanelActions.EVENT_ADD_TRACKED_SCORE_COLUMN, (_event, scoreName: string, scoreId: string, params: any) => {
                // TODO:
            });
            panelRef.current.on(LineUpPanelActions.EVENT_ZOOM_OUT, () => {
                taggleRef.current.zoomOut();
            });
            panelRef.current.on(LineUpPanelActions.EVENT_ZOOM_IN, () => {
                taggleRef.current.zoomIn();
            });

            // TODO: panelRef.current.on(LineUpPanelActions.EVENT_OPEN_VIS, () => {
            //     this.generalVis.toggleCustomVis();
            // });

            if (options.enableOverviewMode) {
                const rule = spaceFillingRule(taggleOptions);

                panelRef.current.on(LineUpPanelActions.EVENT_TOGGLE_OVERVIEW, (_event: any, isOverviewActive: boolean) => {
                    updateLodRules(taggleRef.current.style, isOverviewActive, taggleOptions);
                    (taggleRef.current as TaggleRenderer).switchRule(isOverviewActive ? rule : null);
                });

                if (options.enableOverviewMode === 'active') {
                    panelRef.current.fire(LineUpPanelActions.EVENT_TOGGLE_OVERVIEW, true);
                }
            }
            if (options.enableSidePanel) {
                viewRef.current.appendChild(panelRef.current.node);

                // TODO:    viewRef.current.appendChild(this.generalVis.node);
                if (options.enableSidePanel !== 'top') {
                    taggleRef.current.pushUpdateAble((ctx) => panelRef.current.panel.update(ctx));
                }
            }


            selectionHelperRef.current.on(LineUpSelectionHelper.EVENT_SET_ITEM_SELECTION, (_event, selection: ISelection) => {
                // TODO: selection name??
                const name = AView.DEFAULT_SELECTION_NAME;
                const current = itemSelections.get(name);
                if (current && ViewUtils.isSameSelection(current, selection)) {
                    return;
                }
                const wasEmpty = current == null || current.idtype == null || current.range.isNone;
                itemSelections.set(name, selection);
                // propagate
                if (selection.idtype) {
                    if (name === AView.DEFAULT_SELECTION_NAME) {
                        if (selection.range.isNone) {
                            selection.idtype.clear(SelectionUtils.defaultSelectionType);
                        } else {
                            selection.idtype.select(selection.range);
                        }
                    } else {
                        if (selection.range.isNone) {
                            selection.idtype.clear(name);
                        } else {
                            selection.idtype.select(name, selection.range);
                        }
                    }
                }
                const isEmpty = selection == null || selection.idtype == null || selection.range.isNone;
                if (!(wasEmpty && isEmpty)) {
                    // the selection has changed when we really have some new values not just another empty one
                    onItemSelectionChanged?.();
                }

                onItemSelect?.(current, selection, name);
            });

        }


    }, [lineupParentRef.current, viewRef.current]);

    const build = React.useMemo(() => () => {
        setBusy(true);
        if (!providerRef.current) {
            return;
        }
        columnDesc.forEach((c) => providerRef.current.pushDesc(c as IColumnDesc));
        // TODO: set hint
        providerRef.current.setData(data);
        selectionHelperRef.current.rows = data;
        selectionHelperRef.current.setItemSelection(itemSelections.get(AView.DEFAULT_SELECTION_NAME));
        ColumnDescUtils.createInitialRanking(providerRef.current, {});
        const ranking = providerRef.current.getLastRanking();
        onCustomizeRanking?.(LineupUtils.wrapRanking(providerRef.current, ranking));

        return Promise.resolve()
            .then(async () => {
                return selectionAdapter?.selectionChanged(null, createContext);
            }).then(() => {
                onBuiltLineUp?.(providerRef.current);
                setBusy(false);
                taggleRef.current.update();
            }).catch(ErrorAlertHandler.getInstance().errorAlert)
            .catch((error) => {
                console.error(error);
                setBusy(false);
            });

    }, []);

    const {status} = useAsync(build, []);

    return <div ref={viewRef} className={`tdp-view lineup lu-taggle lu ${busy ? 'tdp-busy' : ''}`}>
        <div ref={lineupParentRef}>

        </div>
    </div>;
}
