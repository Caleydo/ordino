import { useCallback, useEffect, useState } from "react";
/**
 * Execute an async function without side effects
 * @see https://usehooks.com/useAsync/
 * @param asyncFunction Async function call
 * @param immediate Execute the function immediately
 */
export function useAsync(asyncFunction, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(() => {
        setStatus('pending');
        setValue(null);
        setError(null);
        return asyncFunction()
            .then(response => {
            setValue(response);
            setStatus('success');
        })
            .catch(error => {
            setError(error);
            setStatus('error');
        });
    }, [asyncFunction]);
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    return { execute, status, value, error };
}
;
//# sourceMappingURL=useAsync.js.map