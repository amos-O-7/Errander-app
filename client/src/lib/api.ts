const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5033/api';

let _logoutFn: (() => void) | null = null;

/** Call this once from App to wire up auto-logout on 401. */
export function setupAuthInterceptor(logout: () => void) {
    _logoutFn = logout;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    } as Record<string, string>;

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetch(url, { ...options, headers });

    // Auto-logout on 401 Unauthorized
    if (response.status === 401) {
        _logoutFn?.();
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const error = await response.json();
            errorMessage = error.message || error.error || response.statusText;
        } catch {
            // ignore json parse error
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return {} as T;
}

/** Upload a file using multipart/form-data (does NOT set Content-Type — browser does it). */
export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('token');
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: formData,
    });

    if (response.status === 401) {
        _logoutFn?.();
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const error = await response.json();
            errorMessage = error.message || error.error || response.statusText;
        } catch { /* ignore */ }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return {} as T;
}
