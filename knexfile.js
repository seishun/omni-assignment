module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/configs_test',
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/configs',
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  }
};
