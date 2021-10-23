import * as React from 'react';
import {useSelector} from 'react-redux';
import {Workbench} from './Workbench';
import {DummyWorkbench} from './DummyWorkbench';

export function Filmstrip() {
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    // const dispatch = useDispatch();

    return (
        <div className="ordino-filmstrip">
            {ordino.views.map((v) => {
                return (
                    <Workbench
                        type={
                            v.index === 0 && v.index === ordino.focusViewIndex
                                ? 'First'
                                : v.index === ordino.focusViewIndex
                                    ? 'Focus'
                                    : v.index === ordino.focusViewIndex - 1
                                        ? 'Context'
                                        : v.index === ordino.focusViewIndex + 1
                                            ? 'Next_DVC'
                                            : v.index > ordino.focusViewIndex
                                                ? 'Next'
                                                : 'Previous'
                        }
                        view={v}
                        key={v.id}
                    />
                );
            })}
            {ordino.focusViewIndex === ordino.views.length - 1 ? (
                <DummyWorkbench view={null} key={'chooserOnlyView'} />
            ) : null}
        </div>
    );
}
