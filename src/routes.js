import { database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

// Campos que podem ser gravados (codpro e data o banco gera sozinho)
const CAMPOS = ['nome', 'descri', 'fabricante', 'qtda', 'preco', 'custo'];

function resposta(res, status, corpo) {
    return res.writeHead(status).end(corpo ? JSON.stringify(corpo) : undefined);
}

export const routes = [
    // LISTAR todos (opcional: /produtos?search=texto filtra por nome/fabricante)
    {
        method: 'GET',
        path: buildRoutePath('/produtos'),
        handler: async (req, res) => {
            const { search } = req.query;

            const { rows } = search
                ? await database.query(
                    'SELECT * FROM produtos WHERE nome ILIKE $1 OR fabricante ILIKE $1 ORDER BY codpro',
                    [`%${search}%`]
                  )
                : await database.query('SELECT * FROM produtos ORDER BY codpro');

            return resposta(res, 200, rows);
        }
    },

    // BUSCAR um pelo código
    {
        method: 'GET',
        path: buildRoutePath('/produtos/:id'),
        handler: async (req, res) => {
            const { rows } = await database.query(
                'SELECT * FROM produtos WHERE codpro = $1', [req.params.id]
            );

            if (rows.length === 0) return resposta(res, 404, { erro: 'Produto não encontrado' });
            return resposta(res, 200, rows[0]);
        }
    },

    // CRIAR
    {
        method: 'POST',
        path: buildRoutePath('/produtos'),
        handler: async (req, res) => {
            const body = req.body ?? {};

            if (!body.nome) return resposta(res, 400, { erro: 'O campo "nome" é obrigatório' });

            const valores = CAMPOS.map(campo => body[campo] ?? null);

            const { rows } = await database.query(
                `INSERT INTO produtos (${CAMPOS.join(', ')})
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                valores
            );

            return resposta(res, 201, rows[0]);
        }
    },

    // ATUALIZAR (PUT = manda o produto completo)
    {
        method: 'PUT',
        path: buildRoutePath('/produtos/:id'),
        handler: async (req, res) => {
            const body = req.body ?? {};

            if (!body.nome) return resposta(res, 400, { erro: 'O campo "nome" é obrigatório' });

            const valores = CAMPOS.map(campo => body[campo] ?? null);

            const { rows } = await database.query(
                `UPDATE produtos
                 SET nome = $1, descri = $2, fabricante = $3, qtda = $4, preco = $5, custo = $6
                 WHERE codpro = $7
                 RETURNING *`,
                [...valores, req.params.id]
            );

            if (rows.length === 0) return resposta(res, 404, { erro: 'Produto não encontrado' });
            return resposta(res, 200, rows[0]);
        }
    },

    // EXCLUIR
    {
        method: 'DELETE',
        path: buildRoutePath('/produtos/:id'),
        handler: async (req, res) => {
            const { rowCount } = await database.query(
                'DELETE FROM produtos WHERE codpro = $1', [req.params.id]
            );

            if (rowCount === 0) return resposta(res, 404, { erro: 'Produto não encontrado' });
            return resposta(res, 204);
        }
    }
];
