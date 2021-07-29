import { Provenance, ProvenanceOpts } from '../Types/Provenance';
/**
 * @template T Represents the given state of an application as defined in initProvenance.
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 * @template A Represents the given "extra" type for storing metadata.
 * Extra is a way to store customized metadata.
 * @param initialState: Initial state for the provenance graph to be created in.
 *  State of the root node.
 * @param _opts: Specify whether or not to loadFromUrl, or utilize firebase integration.
 */
export default function initProvenance<T, S, A = void>(initialState: T, _opts?: Partial<ProvenanceOpts<T>>): Provenance<T, S, A>;
