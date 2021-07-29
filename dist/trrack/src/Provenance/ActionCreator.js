/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
import { action, toJS } from 'mobx';
/**
 *
 * @template T State of the application
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 *
 * @param func Defines the function which will be executed on provenance apply
 *
 */
// TODO:: Switch Args and S here.
export default function createAction(func) {
    let _label;
    let _actionType = 'Regular';
    let _stateSaveMode = 'Diff';
    let _eventType;
    let _meta = {};
    const actionObject = (...args) => {
        return {
            apply: action((state, label) => {
                if (!_label)
                    throw new Error('Please specify a default label when you create the action');
                if (!label)
                    label = _label;
                func(state, ...args);
                return {
                    state: toJS(state),
                    label: label,
                    stateSaveMode: _stateSaveMode,
                    actionType: _actionType,
                    eventType: _eventType,
                    meta: _meta,
                };
            }),
        };
    };
    actionObject.setLabel = function (label) {
        _label = label;
        return this;
    };
    actionObject.setActionType = function (actionType) {
        _actionType = actionType;
        return this;
    };
    actionObject.saveStateMode = function (mode) {
        _stateSaveMode = mode;
        return this;
    };
    actionObject.setEventType = function (evtType) {
        _eventType = evtType;
        return this;
    };
    actionObject.setMetaData = function (m) {
        _meta = m;
        return this;
    };
    return actionObject;
}
//# sourceMappingURL=ActionCreator.js.map