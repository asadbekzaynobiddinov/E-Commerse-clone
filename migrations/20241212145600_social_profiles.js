/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('social_profiles', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid());
    table.uuid('user_id').references('id').inTable('users');
    table.string('platform').notNullable();
    table.string('platform_username').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable('social_profiles');
};
