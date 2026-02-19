import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiFetch } from './api';

export function useApiQuery<T>(key: any[], endpoint: string, options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>) {
    return useQuery<T, Error>({
        queryKey: key,
        queryFn: () => apiFetch<T>(endpoint),
        ...options,
    });
}

export function useApiMutation<T, TVariables>(
    endpoint: string | ((variables: TVariables) => string),
    options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' } & UseMutationOptions<T, Error, TVariables>
) {
    const { method = 'POST', ...mutationOptions } = options || {};

    return useMutation<T, Error, TVariables>({
        mutationFn: (variables: TVariables) => {
            const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;
            return apiFetch<T>(url, {
                method,
                body: (method !== 'GET' && variables) ? JSON.stringify(variables) : undefined,
            });
        },
        ...mutationOptions,
    });
}
