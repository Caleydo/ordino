import * as React from 'react';
import { useAppDispatch } from '../hooks';
import { initialOrdinoState, IOrdinoAppState } from '../store';
import { initializeTrrack, setReduxFromTrrackAction, Trrack, TrrackProvider, TRRACK_ACTION } from '../store/provenance';
import { Breadcrumb } from './Breadcrumb';
import FloatingActionButton from './components/FloatingActionButton';
import { Filmstrip } from './Filmstrip';

export let trrackInstance: {
  uid: string;
  trrack: Trrack;
} | null = null;

export function Ordino() {
  const dispatch = useAppDispatch();

  const { uid, trrack } = React.useMemo(() => {
    return {
      uid: Math.random().toString(),
      trrack: initializeTrrack({
        initialState: initialOrdinoState,
        setter: (state: IOrdinoAppState) => {
          dispatch({
            type: TRRACK_ACTION,
            payload: state,
          });
        },
      }),
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (trrackInstance && trrackInstance.uid === uid) return;

    trrackInstance = { uid, trrack };
  }, [uid, trrack]);

  return (
    <div id="content">
      <main data-anchor="main" className="targid">
        <TrrackProvider value={trrack}>
          <Breadcrumb />
          <Filmstrip />
          <div style={{ padding: '1em', display: 'flex', justifyContent: 'space-around' }}>
            <FloatingActionButton onClick={() => trrack.undo()}>Undo</FloatingActionButton>
            <FloatingActionButton onClick={() => trrack.redo()}>Redo</FloatingActionButton>
          </div>
        </TrrackProvider>
      </main>
    </div>
  );
}
