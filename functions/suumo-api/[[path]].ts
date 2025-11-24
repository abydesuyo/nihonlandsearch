interface Env {
    [key: string]: any;
}

interface EventContext {
    request: Request;
    env: Env;
    params: Record<string, string | string[]>;
    waitUntil: (promise: Promise<any>) => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    data: Record<string, unknown>;
}

export async function onRequest(context: EventContext) {
    const url = new URL(context.request.url);

    // Strip /suumo-api from the path to get the target path
    // Example: /suumo-api/jj/bukken/... -> /jj/bukken/...
    const targetPath = url.pathname.replace('/suumo-api', '');
    const targetUrl = 'https://suumo.jp' + targetPath + url.search;

    // Create a new request with the target URL
    const newRequest = new Request(targetUrl, {
        method: context.request.method,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    try {
        const response = await fetch(newRequest);

        // Recreate the response to ensure we can modify headers
        const newResponse = new Response(response.body, response);

        // Add CORS headers (useful if accessed from other domains, but mainly for good measure)
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return newResponse;
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return new Response('Proxy Error: ' + errorMessage, { status: 500 });
    }
}
