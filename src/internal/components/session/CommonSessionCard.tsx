import {GlobalEventHandler, I18nextManager, IProvenanceGraphDataDescription, UserSession} from 'phovea_core';
import {FormDialog} from 'phovea_ui';
import React, {useRef} from 'react';
import {Card} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler} from 'tdp_core';
import {OrdinoAppContext} from '../../menu/StartMenuReact';

interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: (sessionAction: SessionActionChooser) => React.ReactNode;
}


/**
 * Types of actions exposed by the CommonSessionCard component
 */
export const enum Action {
    SELECT = 'select',
    SAVE = 'save',
    EDIT = 'edit',
    CLONE = 'clone',
    EXPORT = 'epxport',
    DELETE = 'delete',
}

export type SessionActionChooser = (type: Action, event: React.MouseEvent<DropdownItemProps | HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;
export type SessionAction = (event: React.MouseEvent<DropdownItemProps | HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;


/**
 * Wrapper component that exposes actions to be used in children components.
 */
export function CommonSessionCard({cardName, faIcon, cardInfo, children}: ICommonSessionCardProps) {

    const parent = useRef(null);
    const {app} = React.useContext(OrdinoAppContext);

    const selectSession = (event: React.MouseEvent<DropdownItemProps | HTMLElement, MouseEvent>, desc: IProvenanceGraphDataDescription) => {
        event.preventDefault();
        event.stopPropagation();
        if (UserSession.getInstance().canWrite(desc)) {
            app.graphManager.loadGraph(desc);
        } else {
            app.graphManager.cloneLocal(desc);
        }
        return false;
    };

    const saveSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
        event.preventDefault();
        event.stopPropagation();

        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(desc).then((extras: any) => {
            if (extras !== null) {
                app.graphManager.importExistingGraph(desc, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };


    // TODO why is the check for the graph necessary here?
    const editSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription, callback?: any) => {
        event.preventDefault();
        event.stopPropagation();
        // if (graph) {
        //   return false;
        // }
        ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(desc, {permission: ProvenanceGraphMenuUtils.isPersistent(desc)}).then((extras) => {
            if (extras !== null) {
                Promise.resolve(app.graphManager.editGraphMetaData(desc, extras))
                    .then((desc) => {

                        callback((sessions) => {
                            const copy = [...sessions];
                            const i = copy.findIndex((s) => s.id === desc.id);
                            copy[i] = desc;
                            return copy;
                        });
                        GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
                    })
                    .catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };


    const cloneSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
        event.preventDefault();
        event.stopPropagation();

        app.graphManager.cloneLocal(desc);
        return false;
    };

    // TODO refactor this to export the correct graph. Now it exports the current one.
    const exportSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
        event.preventDefault();
        event.stopPropagation();

        if (!app.graph) {
            return false;
        }

        // console.log(graph);
        const r = app.graph.persist();
        // console.log(r);
        const str = JSON.stringify(r, null, '\t');
        //create blob and save it
        const blob = new Blob([str], {type: 'application/json;charset=utf-8'});
        const a = new FileReader();
        a.onload = (e) => {
            const url = (e.target).result as string;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${app.graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', {name: app.graph.desc.name}), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };


    const deleteSession = async (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription, callback?: any) => {
        event.preventDefault();
        event.stopPropagation();
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', {name: desc.name}));
        if (deleteIt) {
            await Promise.resolve(app.graphManager.delete(desc)).then((r) => {
                if (callback) {
                    NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
                    callback((sessions) => sessions?.filter((t) => t.id !== desc.id));
                } else {
                    app.graphManager.startFromScratch();
                }
            }).catch(ErrorAlertHandler.getInstance().errorAlert);
        }
        return false;
    };


    const sessionAction = (type: Action, event: React.MouseEvent<HTMLElement | DropdownItemProps, MouseEvent>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => {
        switch (type) {
            case Action.SELECT:
                return selectSession(event, desc);
            case Action.SAVE:
                return saveSession(event, desc);
            case Action.EDIT:
                return editSession(event, desc, updateSessions);
            case Action.CLONE:
                return cloneSession(event, desc);
            case Action.EXPORT:
                return exportSession(event, desc);
            case Action.DELETE:
                return deleteSession(event, desc, updateSessions);
        }
    };

    return <>
        <h4 className="text-left d-flex align-items-center mb-3"><i className={`mr-2 ordino-icon-2 fas ${faIcon}`} ></i>{cardName}</h4>
        <Card ref={parent} className="shadow-sm">
            <Card.Body className="p-3">
                {cardInfo || <Card.Text>
                    {cardInfo}
                </Card.Text>}
                {children(sessionAction)}
            </Card.Body>
        </Card>
    </>;
}
