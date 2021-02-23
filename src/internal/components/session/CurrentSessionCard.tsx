import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React, {useRef} from 'react';
import {Card} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {byDateDesc, TemporarySessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';


export function CurrentSessionCard() {

    const stopEvent = (event: React.MouseEvent<any>) => {
        event.preventDefault();
        event.stopPropagation();    };

    const parent = useRef(null)
    const [currentSession, setCurrentSession] = React.useState(null);
    const {graph, manager} = React.useContext(GraphContext);

    const listSessions = React.useMemo(() => async () => {
        const tempSessions = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setCurrentSession(tempSessions?.[0]);
    }, []);

    const {status, error} = useAsync(listSessions);


    const deleteSession = async (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', {name: value.name}));
        if (deleteIt) {
            await manager.delete(value);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), value.name);
            // setCurrentSession(tempSessions?.filter((t) => t.id !== value.id));
            // What happens when you delete the current session
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
              console.log('hello')
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
            <h4 className="text-left d-flex align-items-center mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Current Session</h4>
            <Card  ref={parent} className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        Save the current session to open it later again or share it with other users.
                </Card.Text>
                    <TemporarySessionListItem status={status} exportSession={exportSession} saveSession={saveSession} cloneSession={cloneSession} deleteSession={deleteSession} value={currentSession} error={error} />
                </Card.Body>
            </Card>
        </>
    );

}
