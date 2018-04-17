
exports.up = function(knex, Promise) {
  return knex.schema.createTable('device', function(t){
  	t.increments('id').primary()
  	t.string('devicename').notNullable()
  	t.timestamps(false,true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('device')
};
