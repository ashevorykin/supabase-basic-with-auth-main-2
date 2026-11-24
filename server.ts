import { readFileSync } from 'fs';
import path from 'path';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    const fullPath = path.join(import.meta.dir, filePath);

    try {
      const file = Bun.file(fullPath);
      const ext = path.extname(fullPath);
      return new Response(file, {
        headers: { 'Content-Type': mimeTypes[ext] ?? 'text/plain' },
      });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  },
});

console.log(`Server listening on port ${port}`);