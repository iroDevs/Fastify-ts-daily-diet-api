import { knex as setupKnex } from 'knex';
import env from '../env/env';
import path from 'path';

export const config = {
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: env.DB_FILE_PATH,
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations'),
    },
}

export const kenex = setupKnex(config);