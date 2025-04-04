const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL!;

export function generatePath(path: string = ""): string {
    let finalUrl = getApiUrl()
    if (path) {
        finalUrl += path
    }
    return finalUrl
}

