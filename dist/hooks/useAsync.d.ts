/**
 * Execute an async function without side effects
 * @see https://usehooks.com/useAsync/
 * @param asyncFunction Async function call
 * @param immediate Execute the function immediately
 */
export declare function useAsync<V = any, E = any>(asyncFunction: any, immediate?: boolean): {
    execute: () => any;
    status: string;
    value: V;
    error: E;
};
