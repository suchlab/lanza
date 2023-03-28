# Lanza
![CI](https://github.com/suchlab/lanza/actions/workflows/ci.yaml/badge.svg)

Lanza is a launch-ready server tools package to create APIs

# Server

```js
import { Server } from 'lanza';

const server = new Server();
await server.start();
```

Without any configuration this server already has:
- Initialized in the 8000 port
- /health endpoint
- 404 errors
- Error handler (no app crashes)
- Disabled `x-powered-by` header
- Incoming JSON requests parsed
- CORS

## Installation
You will have to install the `lanza` package:

```
npm install lanza
```

## Options
| Option | Default | Description |
|---|---|---|
| hostname | ` ` | Hostname for the API |
| port | `8000` | Port to access the API |
| cors | `true` | CORS enabled to accept requests from anywhere |
| versions | `[]` | API versions. Check below for more details |
| healthCheck | `null` | Custom /health endpoint response |
| error404 | `null` | Custom 404 error response |
| maxBodySize | `200mb` | Max body size the API can receive |
| rawBody | `false` | Option to store the unparsed request in `req.rawBody`  |
| logger | `null` | Custom logger to log errors |

## Versions
You can use various API versions in Lanza. You have to pass the array of versions to the `versions` option of the server.

| Option | Description |
|---|---|
| path | Path for the versions (e.g. `/v1`) |
| routes | Array of routes. Check below for more details |
| middlewares | Array of conditional middlewares for the routes. Check below for more details |

## Routes
| Option | Description |
|---|---|
| path | Path of the resource without the version path (e.g. `/users`) |
| method | Method of the request (e.g. `post`) |
| handler | Function that will handle the request |
| dto | Function that will get your response and transform it before returning it to the client |

## Middlewares
| Option | Description |
|---|---|
| condition | Function to check if the path fulfills the condition to execute the middleware |
| handler | Function that will act as a middleware |

> Note: The order of the middlewares matter

## Responses
There is no need to use `res.status(200).send(...)` anymore (although you still can).

You can directly return booleans, text, and objects and Lanza will handle the responses for you:

| Type | Response |
|---|---|
| boolean | `{ "success": true }` or `{ "success": false }` |
| string | Will return the string |
| JSON | Will return the JSON with its content type |

## Errors
If an error occurs and it is thrown, Lanza will return the error in a specific format:
```json
{
  "error": {
    "message": "Custom error message"
  }
}
```

## Example
```js
import { Server } from 'lanza';

const server = new Server({
  port: 8008,
  rawBody: true,
  versions: [
    {
      path: '/v1',
      middlewares: [
        {
          condition: (route) => !!route.executeMiddleware,
          handler: (req, _res, next) => {
            req.middlewareExecuted = true;
            next();
          }
        }
      ],
      routes: [
        {
          method: 'get',
          path: '/test',
          executeMiddleware: true,
          handler: (req) => {
            console.log(req.middlewareExecuted);
            return true;
          }
        }
      ],
    }
  ]
});

await server.start();
```

Making a request to `/test` would log a `true` and the client would receive a `{ "success": true }`
