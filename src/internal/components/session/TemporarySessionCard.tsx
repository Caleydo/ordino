import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React from 'react';
import {Card} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils} from 'tdp_core';
import {TemporarySessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';



export function byDateDesc(a: any, b: any) {
    return -((a.ts || 0) - (b.ts || 0));
}


export function TemporarySessionCard() {
    const stopEvent = (event: React.MouseEvent<any>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const [tempSessions, setTempSessions] = React.useState(null);
    const {manager} = React.useContext(GraphContext);

    const listSessions = React.useMemo(() => async () => {
        const tempSessions = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setTempSessions(tempSessions);
    }, []);

    const {status, error} = useAsync(listSessions);

    const deleteSession = async (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', {name: value.name}));
        if (deleteIt) {
            await manager.delete(value);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), value.name);
            setTempSessions(tempSessions?.filter((t) => t.id !== value.id));
        }
        return false;
    };

    const saveSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(value).then((extras: any) => {
            if (extras !== null) {
                manager.importExistingGraph(value, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };

    const cloneSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        manager.cloneLocal(value);
        return false;
    };

    return (
        <>
            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Temporary Sessions</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                        of this session with others. Only the 10 most recent sessions will be stored.
                    </Card.Text>
                    {
                        tempSessions?.map((tempSession) => <TemporarySessionListItem key={tempSession.id} status={status} value={tempSession} error={error} saveSession={saveSession} cloneSession={cloneSession} deleteSession={deleteSession} />)
                    }
                </Card.Body>
            </Card>
        </>
    );
}
