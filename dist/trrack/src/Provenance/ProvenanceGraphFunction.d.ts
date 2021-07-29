import { ApplyObject } from '../Types/Action';
import { NodeID } from '../Types/Nodes';
import { ProvenanceGraph } from '../Types/ProvenanceGraph';
import { JsonValue, Serializer } from '../Types/Serializers';
export declare function createProvenanceGraph<S, A>(state: JsonValue): ProvenanceGraph<S, A>;
export declare const goToNode: <S, A>(graph: ProvenanceGraph<S, A>, id: NodeID) => void;
export declare const applyActionFunction: <T, S, A>(_graph: ProvenanceGraph<S, A>, actionFn: ApplyObject<T, S>, currentState: T, serialize: Serializer<T>, customLabel?: string) => import("../Types/Nodes").ProvenanceNode<S, A>;
export declare const importState: <S, A>(graph: ProvenanceGraph<S, A>, importedState: JsonValue) => void;
