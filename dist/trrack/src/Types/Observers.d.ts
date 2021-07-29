import { ProvenanceGraph } from './ProvenanceGraph';
export declare type ChangeType = 'CurrentChanged' | 'NodeAdded' | 'Any';
export declare type GlobalObserver<S, A> = (graph?: ProvenanceGraph<S, A>, changeType?: ChangeType) => void;
export declare type ObserverExpression<T, P> = (state: T) => P;
export declare type ObserverEffect<P> = (state?: P, previousState?: P) => void;
