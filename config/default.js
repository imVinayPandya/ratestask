module.exports = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  includeErrorStackTrace: false,
  disableLogger: false,
  morganFormat:
    ':method :url HTTP/:http-version :status :res[content-length] :referrer :remote-addr - :remote-user :user-agent :ip',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  openExchangeRates: {
    apiEndpoint: process.env.OPEN_EXCH_API_ENDPOINT,
    appId: process.env.OPEN_EXCH_APP_ID
  },
  joi: {
    validationOption: {
      abortEarly: true, //  False will include all errors
      allowUnknown: true, // ignore unknown properties
      stripUnknown: true // remove unknown properties
    }
  }
};
