import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const PORT = process.env.PORT ?? 3333;

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    await json(req, res);

    // Acha a rota pelo método + regex da URL
    const route = routes.find(route => route.method === method && route.path.test(url));

    if (!route) {
        return res.writeHead(404).end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }

    // Separa os parâmetros da URL: /produtos/5 -> params.id = 5 | ?search=x -> query.search = x
    const { query, ...params } = url.match(route.path).groups ?? {};
    req.params = params;
    req.query = Object.fromEntries(new URLSearchParams(query ?? ''));

    try {
        return await route.handler(req, res);
    } catch (error) {
        console.error(error);
        // 22P02 = id inválido (ex: /produtos/abc)
        const status = error.code === '22P02' ? 400 : 500;
        return res.writeHead(status).end(JSON.stringify({ erro: error.message }));
    }
});

server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
