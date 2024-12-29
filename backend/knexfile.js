module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'project'
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }
  };