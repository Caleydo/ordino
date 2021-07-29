import { Diff } from 'deep-diff';
import { ActionType } from './Action';
import { ProvenanceGraph } from './ProvenanceGraph';
import { JsonValue } from './Serializers';
export declare type DiffExport<L, R = L> = Diff<L, R>;
export declare type NodeID = string;
export declare type Meta = {
    [key: string]: any;
};
export declare type NodeMetadata<S> = {
    createdOn?: number;
    eventType: S | 'Root';
} & Meta;
declare type BaseArtifact = {
    timestamp: number;
};
export declare type Annotation = BaseArtifact & {
    annotation: string;
};
export declare type Artifact<A> = BaseArtifact & {
    artifact: A;
};
export declare type Artifacts<A> = {
    annotations: Annotation[];
    customArtifacts: Artifact<A>[];
};
export interface BaseNode<S> {
    id: NodeID;
    label: string;
    metadata: NodeMetadata<S>;
    children: NodeID[];
    actionType: ActionType;
    bookmarked: boolean;
}
export interface RootNode<S> extends BaseNode<S> {
    state: JsonValue;
}
export interface ChildNode<S, A> extends BaseNode<S> {
    parent: NodeID;
    artifacts: Artifacts<A>;
}
export interface StateNode<S, A> extends RootNode<S>, ChildNode<S, A> {
}
export interface DiffNode<S, A> extends ChildNode<S, A> {
    diffs: Diff<JsonValue>[];
    lastStateNode: NodeID;
}
export declare type ProvenanceNode<S, A> = RootNode<S> | StateNode<S, A> | DiffNode<S, A>;
export declare type Nodes<S, A> = {
    [key: string]: ProvenanceNode<S, A>;
};
export declare type CurrentNode<S, A> = ProvenanceNode<S, A>;
/**
 * Function for checking if a node is a state node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a state node.
 */
export declare function isStateNode<S, A>(node: ProvenanceNode<S, A>): node is StateNode<S, A>;
/**
 * Function for checking if a node is a diff node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a diff node.
 */
export declare function isDiffNode<S, A>(node: ProvenanceNode<S, A>): node is DiffNode<S, A>;
/**
 * Function for checking if a node is a child node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 *  Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is a child node.
 */
export declare function isChildNode<S, A>(node: ProvenanceNode<S, A>): node is DiffNode<S, A> | StateNode<S, A>;
/**
 * Function for checking if a node is the root node.
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param _opts: Given node to check if it is root.
 */
export declare function isRootNode<S, A>(node: ProvenanceNode<S, A>): node is RootNode<S>;
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
export declare function getState<S, A>(graph: ProvenanceGraph<S, A>, node: ProvenanceNode<S, A>): JsonValue;
export {};
