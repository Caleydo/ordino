import { action } from 'mobx';
import { getState, isChildNode, isDiffNode, } from '../Types/Nodes';
import differ from '../Utils/Differ';
import generateTimeStamp from '../Utils/generateTimeStamp';
import generateUUID from '../Utils/generateUUID';
export function createProvenanceGraph(state) {
    const root = {
        id: generateUUID(),
        label: 'Root',
        metadata: {
            createdOn: generateTimeStamp(),
            eventType: 'Root',
        },
        children: [],
        state,
        actionType: 'Regular',
        bookmarked: false,
    };
    const graph = {
        nodes: {
            [root.id]: root,
        },
        root: root.id,
        current: root.id,
    };
    return graph;
}
function createNewStateNode(parent, state, label, actionType, eventType, meta) {
    return {
        id: generateUUID(),
        label,
        metadata: {
            createdOn: generateTimeStamp(),
            eventType,
            ...meta,
        },
        artifacts: {
            annotations: [],
            customArtifacts: [],
        },
        parent,
        children: [],
        state,
        actionType,
        bookmarked: false,
    };
}
function createNewDiffNode(parent, label, diffs, actionType, previousStateId, eventType, meta) {
    return {
        id: generateUUID(),
        label,
        metadata: {
            createdOn: generateTimeStamp(),
            eventType,
            ...meta,
        },
        artifacts: {
            annotations: [],
            customArtifacts: [],
        },
        parent,
        children: [],
        lastStateNode: previousStateId,
        diffs,
        actionType,
        bookmarked: false,
    };
}
// export const updateMobxObservable = action(<T>(oldObject: T, newObject: T) => {
//   Object.keys(oldObject).forEach((k) => {
//     const key: Extract<keyof T, string> = k as any;
//     const oldValue = oldObject[key];
//     const newValue = newObject[key];
//     if (newValue !== oldValue) {
//       let val = newObject[key];
//       val = (typeof val).toString() === 'object' ? observable(val) : val;
//       oldObject[key] = val;
//     }
//   });
// });
export const goToNode = action((graph, id) => {
    const newCurrentNode = graph.nodes[id];
    if (!newCurrentNode)
        throw new Error(`Node with id: ${id} does not exist`);
    graph.current = newCurrentNode.id;
});
export const applyActionFunction = action((_graph, actionFn, currentState, 
// eslint-disable-next-line no-unused-vars
serialize, customLabel) => {
    const graph = _graph;
    const { current: currentId } = graph;
    const currentNode = graph.nodes[currentId];
    let previousState = null;
    let previousStateID = null;
    if (isDiffNode(currentNode)) {
        // previousState = getState(graph, graph.nodes[currentNode.lastStateNode]);
        previousState = getState(graph, currentNode);
        previousStateID = currentNode.lastStateNode;
    }
    else {
        previousState = getState(graph, currentNode);
        previousStateID = currentNode.id;
    }
    let saveDiff = isChildNode(currentNode);
    const { state, stateSaveMode, actionType, label, eventType, meta } = actionFn.apply(currentState, customLabel);
    console.log(stateSaveMode);
    const parentId = graph.current;
    const serializedState = serialize(state);
    const diffs = differ(previousState, serializedState) || [];
    // if (saveDiff && Object.keys(previousState).length / 2 < diffs.length) {
    //   saveDiff = false;
    // }
    saveDiff = saveDiff && stateSaveMode === 'Diff';
    const newNode = saveDiff
        ? createNewDiffNode(parentId, label, diffs, actionType, previousStateID, eventType, meta)
        : createNewStateNode(parentId, serializedState, label, actionType, eventType, meta);
    graph.nodes[newNode.id] = newNode;
    graph.nodes[currentId].children.push(newNode.id);
    graph.current = newNode.id;
    return graph.nodes[graph.current];
    // End
});
export const importState = action((graph, importedState) => {
    const newNode = createNewStateNode(graph.current, importedState, 'Import', 'Regular', null, {});
    graph.nodes[newNode.id] = newNode;
    graph.current = newNode.id;
});
//# sourceMappingURL=ProvenanceGraphFunction.js.map