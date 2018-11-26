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
  return await db.createTable('item_tags_tag', {
    itemId: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      foreignKey: {
        name: 'item_tag_id_fk',
        table: 'item',
        rules: {
          onDelete: 'NO ACTION',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    tagId: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      foreignKey: {
        name: 'tag_item_id_fk',
        table: 'tag',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
  });
};

exports.down = async function (db) {
  return await db.dropTable('item_tags_tag')
};

exports._meta = {
  "version": 1
};
