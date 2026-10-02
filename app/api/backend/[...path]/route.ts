import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';
const API_KEY = process.env.API_KEY ?? '1';

/**
 * Server-side прокси до FastAPI.
 * Добавляет заголовок X-API-Key, чтобы фронт не делал preflight
 * и не светил ключ в браузере.
 */
async function proxy(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;

    const pathname = '/' + (path?.join('/') ?? '');
    const search = req.nextUrl.search; // включает ведущий "?"
    const target = `${BACKEND_URL}${pathname}${search}`;

    const headers = new Headers(req.headers);
    // убираем заголовки, которые мешают прокси
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');
    // добавляем API-ключ
    headers.set('X-API-Key', API_KEY);

    // передаём body только для методов с телом
    const hasBody = !['GET', 'HEAD'].includes(req.method);

    const backendRes = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? await req.text() : undefined,
        redirect: 'follow',
    });

    const responseHeaders = new Headers(backendRes.headers);
    // убираем заголовки, которые ломают CORS/редиректы
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');

    return new NextResponse(backendRes.body, {
        status: backendRes.status,
        statusText: backendRes.statusText,
        headers: responseHeaders,
    });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;