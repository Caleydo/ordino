/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import firebase from 'firebase/app';
import 'firebase/database';
export function initializeFirebase(config) {
    const app = firebase.apps.length === 0 ? firebase.initializeApp(config) : firebase.app();
    const db = firebase.database(app);
    return {
        config,
        app,
        db,
    };
}
export function logToFirebase(rtd) {
    const addedNodes = [];
    return (graph) => {
        const path = `${graph.root}`;
        const nodes = Object.keys(graph.nodes);
        const nodeToAdd = [];
        nodes.forEach((node) => {
            if (!addedNodes.includes(node)) {
                nodeToAdd.push(node);
                addedNodes.push(node);
            }
        });
        nodeToAdd.forEach((node) => {
            const actualNode = JSON.parse(JSON.stringify(graph.nodes[node]));
            rtd
                .ref(`${path}/nodes/${node}`)
                .set(actualNode)
                .catch((err) => {
                // eslint-disable-next-line no-console
                console.warn(err);
                throw new Error('Something went wrong while logging.');
            });
        });
    };
}
//# sourceMappingURL=FirebaseFunctions.js.map