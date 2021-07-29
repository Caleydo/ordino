import firebase from 'firebase/app';
import 'firebase/database';
import { ProvenanceGraph } from '../Types/ProvenanceGraph';
export declare function initializeFirebase(config: any): {
    config: any;
    app: firebase.app.App;
    db: firebase.database.Database;
};
export declare function logToFirebase(rtd: firebase.database.Database): (graph: ProvenanceGraph<any, any>) => void;
