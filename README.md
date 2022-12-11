# Lanza
![CI](https://github.com/suchlab/lanza/actions/workflows/ci.yaml/badge.svg)

Lanza is a launch-ready server tools package to create APIs

## Server
You will have to install the `lanza` package: `npm install lanza`. Then:

```js
import { Server } from 'lanza';

const server = new Server();
await server.start();
```

Without any configuration this server already has:
- Initialized in the 8000 port
- /health endpoint
- 404 error
- Error handler (no app crashes)
- Disabled `x-powered-by` header
- Incoming JSON requests parsed
