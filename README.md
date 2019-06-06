# mydiet-user-node

*This microservice for MyDiet*

The project provides REST API to access both user data and provide the authentication mechanism for MyDiet.fitness.


## Installation

Run the following commands to setup the project:

```console
$ git clone https://github.com/LerouXavier/mydiet-node.git
$ cd mydiet-node
$ npm install
```

Next, you need to set two environment variables:

- `SESSION_SECRET_KEY`
- `JWT_SIGNING_KEY`

The `SESSION_SECRET_KEY` value must be a long, randomly generated string.  This
value should be unique on your production servers, and never checked into
version control.

The `JWT_SIGNING_KEY` must be a randomly generated, 256-byte, base64 encoded
string.  You can generate this value using the [secure-random][] node library
like so:

```javascript
const secureRandom = require("secure-random");

console.log(secureRandom(256, { type: "Buffer" }).toString("base64"));
```

Like the `SESSION_SECRET_KEY`, `JWT_SIGNING_KEY` must also never be checked into
version control, and must be the same on all production servers.

Finally, you can run:

```console
$ npm start
```

To launch the web server.

**NOTE**: You must have MongoDB installed and working locally in order to run
this project.  It will work with all the default MongoDB options.

**TIP**: Read through the settings specified in `settings.js`.  There are
several options you will want to enable when running a production website.