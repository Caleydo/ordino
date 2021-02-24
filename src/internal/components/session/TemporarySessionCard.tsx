import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React, {useRef} from 'react';
import {Button, Card, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils} from 'tdp_core';
import {ListItemDropdown, SessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';



export function byDateDesc(a: any, b: any) {
    return -((a.ts || 0) - (b.ts || 0));
}


export function TemporarySessionCard() {
    const parent = useRef(null);

    const stopEvent = (event: React.MouseEvent<any>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const [tempSessions, setTempSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);
    const {graph, manager} = React.useContext(GraphContext);

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


    // How to handle export of temorary and saved sessions
    const exportSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        if (!graph) {
            return false;
        }

        console.log(graph);
        const r = graph.persist();
        console.log(r);
        const str = JSON.stringify(r, null, '\t');
        //create blob and save it
        const blob = new Blob([str], {type: 'application/json;charset=utf-8'});
        const a = new FileReader();
        a.onload = (e) => {
            const url = (e.target).result as string;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', {name: graph.desc.name}), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };

    return (
        <>
            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Temporary Sessions</h4>
            <Card ref={parent} className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                        of this session with others. Only the 10 most recent sessions will be stored.
                    </Card.Text>
                    {
                        tempSessions?.map((session) => {
                            return <SessionListItem key={session.id} status={status} value={session} error={error}>
                                <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => saveSession(event, session)}>Save</Button>
                                <ListItemDropdown>
                                    <Dropdown.Item onClick={(event) => cloneSession(event, session)}>Clone</Dropdown.Item>
                                    <Dropdown.Item onClick={(event) => exportSession(event, session)}>Export</Dropdown.Item>
                                    <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, session)}>Delete</Dropdown.Item>
                                </ListItemDropdown>
                            </SessionListItem>;
                        })
                    }
                </Card.Body>
            </Card>
        </>
    );
}
