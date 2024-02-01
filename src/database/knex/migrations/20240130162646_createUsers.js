exports.up = knex => knex.schema.createTable("users", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("numero").notNullable();
    table.text("email").notNullable();
  
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("users");