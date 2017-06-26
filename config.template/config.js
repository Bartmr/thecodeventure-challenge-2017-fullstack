module.exports = {
  mainHttpServer: {
    host: '0.0.0.0',
    port: 443
  }
  hapiAuthCookie: {
    // passwordEncryption: same password as passwordEncryption in githubOauth, with a minimum of 32 characters ,
  },
  githubOAuth: {
    // password: same password as passwordEncryption in hapiAuthCookie, with a minimum of 32 characters ,
    // clientId: ,
    // clientSecret: ,
  }
}
