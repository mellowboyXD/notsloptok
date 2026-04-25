'use client';

import { useState } from "react";

export default function useMutation<T>(mutationCallback: (data: T) => Promise<T> | Promise<boolean>) {
    const [data, setData] = useState<T | boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (body: T) => {
        setIsLoading(true);

        try {
            const res = await mutationCallback(body);
            setData(res);
            setError(null);
        } catch (err) {
            if (err instanceof Error)
                setError(`Error: ${err.message}`);
            else
                setError("Error: unknown error occured");
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, isLoading, execute, error };
}
