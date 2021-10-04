import {IDType} from 'phovea_core';
import React from 'react';
import {AView, FindViewUtils, ISelection, ViewWrapper} from 'tdp_core';
import {ITreeElement, TreeRenderer, viewPluginDescToTreeElementHelper} from 'tdp_ui';
import {useAsync} from '..';
import {Range} from 'phovea_core';


interface IChooserProps {
    previousWrapper: ViewWrapper;
    onOpenView: (viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?) => void;

}

// tslint:disable-next-line: variable-name
export const Chooser = ({previousWrapper, onOpenView}: IChooserProps) => {
    const [inputSelection, setInputSelection] = React.useState<ISelection>(previousWrapper.getItemSelection());
    const [openView, setOpenView] = React.useState<Boolean>(false);
    const [initialized, setInitialized] = React.useState(false);

    const loadViews = React.useMemo(() => () => {

        if (!inputSelection || inputSelection.range.isNone) {
            return Promise.resolve([]);
        }
        return FindViewUtils.findAllViews(inputSelection.idtype)
            .then((views) => viewPluginDescToTreeElementHelper(views));
    }, [inputSelection]);

    React.useEffect(() => {

        const listener = (_, oldSelection: ISelection, newSelection: ISelection) => {
            if (!(oldSelection.range.isNone && newSelection.range.isNone)) {
                setInputSelection(newSelection);
            }
        };

        previousWrapper.getInstance().on(AView.EVENT_ITEM_SELECT, listener);

        return () => {
            previousWrapper.getInstance()?.off(AView.EVENT_ITEM_SELECT, listener);
        };
    }, [previousWrapper]);

    const {value: views, status} = useAsync(loadViews);

    return <>{status === 'success' && views.length > 0 &&
        < div className="chooser">
            <TreeRenderer groups={views} itemAction={(view) => {
                onOpenView(previousWrapper, view.id, inputSelection.idtype, inputSelection.range);
            }} />
        </div>

    }
    </>;
}

