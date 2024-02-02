exports.up = knex => knex.schema.createTable("subphases", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.boolean("done").notNullable();
    
    table.integer("phase_id").references("id").inTable("phases")

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
  
exports.down = knex => knex.schema.dropTable("subphases");