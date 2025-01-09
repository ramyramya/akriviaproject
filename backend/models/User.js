// filepath: /C:/Users/akrivia/Desktop/angularprojectnew/backend/models/User.js
const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName','dob', 'gender', 'username', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        dob: { type: 'string' },
        gender: { type: 'string', enum: ['Male', 'Female', 'Other'], minLength: 1, maxLength: 255 },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
        photo: { type: 'string' }
      }
    };
  }
}

module.exports = User;