import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import {FormDialog} from 'phovea_ui';
import React, {useRef} from 'react';
import {Card} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler} from 'tdp_core';
import {GraphContext} from '../../menu/StartMenuReact';
import {stopEvent} from '../../menu/utils';

interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: (exportSession: SessionAction, cloneSession: SessionAction, saveSession?: SessionAction, deleteSession?: SessionAction) => React.ReactNode;
}

type SessionAction = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription, callback?: (value: React.SetStateAction<IProvenanceGraphDataDescription[]>) => void) => boolean | Promise<boolean>;


export function CommonSessionCard({cardName, faIcon, cardInfo, children}: ICommonSessionCardProps) {

    const parent = useRef(null);
    const {graph, manager} = React.useContext(GraphContext);

    const saveSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(desc).then((extras: any) => {
            if (extras !== null) {
                manager.importExistingGraph(desc, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };


    const cloneSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
        stopEvent(event);
        manager.cloneLocal(desc);
        return false;
    };

    // TODO refactor this to export the correct graph. Now it exports the current one.
    const exportSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
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


    const deleteSession = async (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription, callback?: (value: React.SetStateAction<IProvenanceGraphDataDescription[]>) => void) => {
        stopEvent(event);
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', {name: desc.name}));
        if (deleteIt) {
            await Promise.resolve(manager.delete(desc)).then((r) => {
                if (callback) {
                    NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
                    callback((sessions) => sessions?.filter((t) => t.id !== desc.id));
                } else {
                    manager.startFromScratch();
                }
            }).catch(ErrorAlertHandler.getInstance().errorAlert);
        }
        return false;
    };

    return <>
        <h4 className="text-left d-flex align-items-center mb-3"><i className={`mr-2 ordino-icon-2 fas ${faIcon}`} ></i>{cardName}</h4>
        <Card ref={parent} className="shadow-sm">
            <Card.Body className="p-3">
                {cardInfo || <Card.Text>
                    {cardInfo}
                </Card.Text>}
                {children(exportSession, cloneSession, saveSession, deleteSession)}
            </Card.Body>
        </Card>
    </>;
}
