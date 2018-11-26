'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  return await db.createTable('tag', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    text: 'string',
    color: 'string',
    description: 'string',
    userId: {
      type: 'int', foreignKey: {
        name: 'tag_user_id_fk',
        table: 'user',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = async function (db) {
  return await db.dropTable('tag')
};

exports._meta = {
  "version": 1
};

// TODO ADD USER_ID TO TAG!!!!!!!!!!!!!!!