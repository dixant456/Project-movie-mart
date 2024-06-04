const {Pool} = require('pg');
const pool = new Pool({
    user: 'default',
    host: 'ep-winter-cherry-a4br1fdq-pooler.us-east-1.aws.neon.tech',
    database: 'verceldb',
    password: 'grQLB12IFkjw',
    port: '5432',
    ssl: {
        require: true,
    }
})

module.exports = pool;