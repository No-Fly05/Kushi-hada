/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 // Drop tables if they exist to start fresh
   return knex.schema
    .dropTableIfExists('edge')
    .dropTableIfExists('node')

  // Create the node table
    .createTable('node', (table) => {
    table.increments('id').primary(); // serial primary key
    table.string('label', 255).notNullable();
  })

  // Create the edge table
   .createTable('edge', (table) => {
    table.increments('id').primary();
    table
      .integer('node1_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('node')
      .onDelete('CASCADE');
    table
      .integer('node2_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('node')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    // Drop tables in reverse order (to avoid foreign key constraint issues)
   return knex.schema.dropTableIfExists('edge')
   .dropTableIfExists('node');
};