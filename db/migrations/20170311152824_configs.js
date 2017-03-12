exports.up = function(knex, Promise) {
  return knex.schema.createTable('configs', function(table) {
    table.increments();
    table.string('client').notNullable();
    table.string('version').notNullable();
    table.string('key').notNullable();
    table.string('value').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('configs');
};
