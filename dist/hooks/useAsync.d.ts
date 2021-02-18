/**
 * Execute an async function without side effects
 * @see https://usehooks.com/useAsync/
 * @param asyncFunction Async function call
 * @param immediate Execute the function immediately
 */
export declare const useAsync: <T, E = string>(asyncFunction: () => Promise<T>, immediate?: boolean) => {
    execute: () => Promise<void>;
    status: "success" | "idle" | "pending" | "error";
    value: T;
    error: E;
};
