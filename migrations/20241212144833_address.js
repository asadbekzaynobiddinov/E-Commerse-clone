/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('address', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).unique().notNullable();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('address_line_1');
    table.string('address_line_2');
    table.string('country').notNullable().defaultTo('Uzbekistan');
    table.string('city').notNullable();
    table.string('postal_code').notNullable();
    table.string('phone_number').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable('address');
};
