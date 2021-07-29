import { ActionFunction, ActionObject } from '../Types/Action';
/**
 *
 * @template T State of the application
 * @template S Represents the given event types in your application.
 * Event types are used to differentiate between different actions that create nodes.
 *
 * @param func Defines the function which will be executed on provenance apply
 *
 */
export default function createAction<T, Args extends unknown[] = unknown[], S = void>(func: ActionFunction<T, Args>): ActionObject<T, S, Args>;
