import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable('receita', table => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('descricao').notNullable();
        table.dateTime('data_hora').notNullable();
        table.boolean('dieta').notNullable();
        table.string('cookie_usuario').notNullable();

        table.integer('usuario_id').unsigned().notNullable();
        table.foreign('usuario_id').references('id').inTable('usuario');

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('receita');

}
