module.exports = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  includeErrorStackTrace: true,
  morganFormat:
    ':method :url HTTP/:http-version :status :res[content-length] :referrer :remote-addr - :remote-user :user-agent :ip',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  openExchangeRates: {
    apiEndpoint: process.env.OPEN_EXCH_API_ENDPOINT,
    appId: process.env.OPEN_EXCH_APP_ID,
  },
};
