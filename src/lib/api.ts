import axios from 'axios';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL!;

export function generatePath(path: string = ""): string {
    let finalUrl = getApiUrl();
    if (path) {
        finalUrl += path;
    }
    return finalUrl;
}

export const axiosConf = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchData = async <T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data: any = null,
    headers: Record<string, string> = {}
): Promise<T> => {
    try {
        const response = await axiosConf.request<T>({
            url: generatePath(path),
            method,
            data,
            headers: {
                ...axiosConf.defaults.headers,
                ...headers,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

export const fetchJson = async <T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data: any = null,
    headers: Record<string, string> = {}
): Promise<T | null> => {
    const url = generatePath(path);
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return (await response.text()) as unknown as T;
    } catch (error) {
        throw error;
    }
};

interface FetchJsonParams {
    params?: Record<string, string | number>;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
}

export const fetchJsonWithParams = async <T>(
    path: string,
    options: FetchJsonParams = {}
): Promise<T | null> => {
    const { params = {}, method = 'GET', data, headers } = options;
    const searchQuery = new URLSearchParams(params as Record<string, string>).toString();
    const fullUrl = searchQuery ? `${generatePath(path)}?${searchQuery}` : generatePath(path);

    return fetchJson<T>(fullUrl, method, data, headers);
};