import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('usuario', table => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cookie').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('usuario');
}
