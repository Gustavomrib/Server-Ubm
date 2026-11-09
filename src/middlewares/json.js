/*
    Middleware: junta os pedaços (chunks) do corpo da requisição (stream),
    converte para JSON e coloca em req.body. Mesmo da aula 08.
*/
export async function json(req, res) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
        req.body = null;
    }

    res.setHeader('Content-Type', 'application/json');
}
