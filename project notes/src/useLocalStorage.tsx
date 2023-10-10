import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            return JSON.parse(storedValue); //transforma em texto json
        }
        if (typeof initialValue === "function") {
                return (initialValue as () => T)();
            }
        return initialValue;
    });

    useEffect(() => {
        if (value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue] as const;
}
    