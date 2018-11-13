'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


exports.up = function (db) {
  return db.addColumn('item', 'userId', {
    type: 'int', foreignKey: {
      name: 'item_user_id_fk',
      table: 'user',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'id'
    }
  });
};

exports.down = function (db) {
  return db.removeColumn('item', 'userId');
};

exports._meta = {
  "version": 1
};
