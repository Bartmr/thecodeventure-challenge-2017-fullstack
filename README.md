## Setup:
* Set environment variables if you just want to run the server without starting any client-side views build or dev systems:
    * `NODE_ENV` - Set to `development` or `production` according to the context.

* Duplicate the `config.template` folder, rename it `config` and

* Change the `config.js` inside the newly duplicated `config` folder and also put your Github OAuth API keys.

* Install dependencies:
```
    $ npm install
```

* Generate your certificates for HTTPS or HTTP/2:
```
    Using Unix or Git Bash on Windows:
    $ mkdir certificates    //starting from the project's root folder
    $ cd certificates

    $ openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
    $ openssl rsa -passin pass:x -in server.pass.key -out server.key
    $ rm server.pass.key
    $ openssl req -new -key server.key -out server.csr
    $ openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

* Launch the project:
```
    $ npm start
```