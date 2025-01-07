const { Model } = require('objection');

class Admin extends Model {
  static get tableName() {
    return 'admin';
  }

  static get idColumn() {
    return 'username'; // Use username as the primary key
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        role: { type: 'string', enum: ['admin'], default: 'admin' }
      }
    };
  }
}

module.exports = Admin;

