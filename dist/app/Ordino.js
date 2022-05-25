import * as React from 'react';
import { useAppDispatch } from '../hooks';
import { initialOrdinoState } from '../store';
import { initializeTrrack, TrrackProvider, TRRACK_ACTION } from '../store/provenance';
import { Breadcrumb } from './Breadcrumb';
import FloatingActionButton from './components/FloatingActionButton';
import { Filmstrip } from './Filmstrip';
export let trrackInstance = null;
export function Ordino() {
    const dispatch = useAppDispatch();
    const { uid, trrack } = React.useMemo(() => {
        return {
            uid: Math.random().toString(),
            trrack: initializeTrrack({
                initialState: initialOrdinoState,
                setter: (state) => {
                    dispatch({
                        type: TRRACK_ACTION,
                        payload: state,
                    });
                },
            }),
        };
    }, [dispatch]);
    React.useEffect(() => {
        if (trrackInstance && trrackInstance.uid === uid)
            return;
        trrackInstance = { uid, trrack };
    }, [uid, trrack]);
    return (React.createElement("div", { id: "content" },
        React.createElement("main", { "data-anchor": "main", className: "targid" },
            React.createElement(TrrackProvider, { value: trrack },
                React.createElement(Breadcrumb, null),
                React.createElement(Filmstrip, null),
                React.createElement("div", { style: { padding: '1em', display: 'flex', justifyContent: 'space-around' } },
                    React.createElement(FloatingActionButton, { onClick: () => trrack.undo() }, "Undo"),
                    React.createElement(FloatingActionButton, { onClick: () => trrack.redo() }, "Redo"))))));
}
//# sourceMappingURL=Ordino.js.map