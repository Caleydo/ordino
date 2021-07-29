/* eslint-disable no-shadow */
import { applyChange } from 'deep-diff';
import { toJS } from 'mobx';
import deepCopy from '../Utils/DeepCopy';
/**
 * Function for checking if a node is a state node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a state node.
 */
export function isStateNode(node) {
    return 'parent' in node && 'state' in node;
}
/**
 * Function for checking if a node is a diff node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a diff node.
 */
export function isDiffNode(node) {
    return 'diffs' in node;
}
/**
 * Function for checking if a node is a child node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 *  Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a child node.
 */
export function isChildNode(node) {
    return 'parent' in node;
}
/**
 * Function for checking if a node is the root node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is root.
 */
export function isRootNode(node) {
    return node.label === 'Root';
}
/**
`* Retrieve the state of a node. `
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param graph: Provenance Graph which we are searching for node in
 * @param _opts: Node which we want the state of
 */
export function getState(graph, node) {
    if (isRootNode(node) || isStateNode(node)) {
        return toJS(node.state);
    }
    // eslint-disable-next-line no-underscore-dangle
    const _state = toJS(graph.nodes[node.lastStateNode].state);
    const state = deepCopy(_state);
    // what is this for?
    node.diffs.forEach((diff) => {
        applyChange(state, null, diff);
    });
    return state;
}
//# sourceMappingURL=Nodes.js.map