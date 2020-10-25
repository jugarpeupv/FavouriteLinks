require('dotenv').config();


module.exports = {
  database: {
    host: process.env.HOSTDATABASE,
    user: process.env.USER,
    password: process.env.USER,
    database: process.env.DATABASE,
  },
};

