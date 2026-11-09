/*
    Conexão com o PostgreSQL (Neon).
    Pool = conjunto de conexões reaproveitadas, em vez de abrir uma nova a cada requisição.
    A URL vem do arquivo .env (DATABASE_URL).
*/
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Neon exige SSL
});

// Atalho: database.query('SELECT ...', [valores])
export const database = {
    query: (sql, params) => pool.query(sql, params)
};
