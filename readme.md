# Proof of work framework (WIP)

![npm publish](https://github.com/hoshiyuki-tamako/pow-framework/workflows/npm%20publish/badge.svg)
![npm](https://img.shields.io/npm/v/pow-framework)
![npm type definitions](https://img.shields.io/npm/types/pow-framework?style=plastic)
![nycrc config on GitHub](https://img.shields.io/nycrc/hoshiyuki-tamako/pow-framework?preferredThreshold=branches)

Provide basic structure for creating proof of work

This library in concept stage, internal implementation may change and not ready for production.

```sh
npm i pow-framework
```

## Usage

### Using builtin proof of work

### Running on single verifier

```ts
import { Argon2VerifierWithJwtLocal, Argon2Worker } from 'pow-framework';

const verifier = new Argon2VerifierWithJwtLocal();
const worker = new Argon2Worker();
const request = await verifier.generate(); // return class object IPowRequest
const result = await worker.work(request); // return class object IPowResult
const correct = await verifier.verify(result); // return boolean
```

### Running on multiple verifier

```ts
import { Argon2VerifierWithJwt, Argon2Worker } from 'pow-framework';

const verifier = new Argon2VerifierWithJwt({
  privateKey: "secret", // secret must be same across all verify servers
});
const worker = new Argon2Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Custom expiration time

```ts
import { Argon2VerifierWithJwt, Argon2Worker } from 'pow-framework';

const verifier = new Argon2VerifierWithJwt({
  privateKey: "secret",
  expirationTime: "2m",  // https://www.npmjs.com/package/ms
});
const worker = new Argon2Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Using work condition

```ts
import { Argon2VerifierWithJwt, Argon2Worker, TimeLimited } from 'pow-framework';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const verifier = new Argon2VerifierWithJwt({
  privateKey: "secret",
  expirationTime: "2m",
});
const worker = new Argon2Worker({
  conditions: [new TimeLimited(dayjs.duration({ seconds: 10 }))], // run 10 seconds
});
const request = await verifier.generate();
try {
  const result = await worker.work(request);
  const correct = await verifier.verify(result);
} catch (e) {
  if (e instanceof PowOverworkError) {
    //
  }
}
```

### Custom work condition

```ts
import { Argon2VerifierWithJwt, Argon2Worker, ICondition } from 'pow-framework';

const condition = {
  shouldContinue() {
    return Math.random() > .5;
  }

  // optional, reset will be call once before work started
  // reset() {
  // }
} as ICondition;

const verifier = new Argon2VerifierWithJwt({
  privateKey: "secret",
  expirationTime: "2m",
});
const worker = new Argon2Worker({
  conditions: [condition],
});
const request = await verifier.generate();
try {
  const result = await worker.work(request);
  const correct = await verifier.verify(result);
} catch (e) {
  if (e instanceof PowOverworkError) {
    //
  }
}
```

### Using work generator

work generator use for generating data before worker doing work.

it can be storing extra meta data using jwt or other method that return a string or custom format (require custom logic).

```ts
import { Argon2Verifier, Argon2Worker, WorkJwt } from 'pow-framework';

// create work generator
const workGenerator = new WorkJwt({
  privateKey: "secret"
});

const verifier = new Argon2Verifier({ workGenerator });
const worker = new Argon2Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Custom work generator

Work generator only handles data generation, it does not do any proof of work (e.g. hashing).

Proof of work should be handled inside Verifier/Worker.

```ts
import { IWorkGenerator, Argon2Verifier, Argon2Worker } from 'pow-framework';

const workGenerator = {
  generate() {
    return new Date().toString();
  },
  verify(data: string) {
    return isFinite(+new Date(data));
  }
} as IWorkGenerator;

const verifier = new Argon2Verifier({ workGenerator });
const worker = new Argon2Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Custom work generator with  different return type

```ts
import { IWorkGenerator, PowUnsupportedGenerateType, Argon2Verifier, Argon2Worker } from 'pow-framework';

const workGenerator = {
  generate({ type }: { type: "string" | "number" | "date" }) {
    const date = new Date();
    // check if type === null || type === undefined, assume user want type === string
    if (!type || type === "string") {
      return date.toString();
    } else if (type === "number") {
      return +date;
    } else if (type === "date") {
      return date;
    } else {
      throw new PowUnsupportedGenerateType();
    }
  },
  verify(data: string | number | Date) {
    return isFinite(+new Date(data));
  }
} as IWorkGenerator;

const verifier = new Argon2Verifier({ workGenerator });
const worker = new Argon2Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Custom algorithm

Example of creating a MD5 proof of work by checking `md5(server_data + client_randomChar).match(/^[a-z]{12}/)`

`src/algorithms/md5` for example code

```ts
import { Md5Verifier, Md5Worker, WorkString } from 'pow-framework';

const verifier = new Md5Verifier({
  workGenerator: new WorkString(),
});
const worker = new Md5Worker();
const request = await verifier.generate();
const result = await worker.work(request);
const correct = await verifier.verify(result);
```

### Web server example

#### Server Api

```ts
import { Argon2Verifier, WorkJwt } from 'pow-framework';

import express from 'express';
import bodyParser from 'body-parser';

const workGenerator = new WorkJwt({
  privateKey: "secret" // Make sure using 'key rotation' for the secret value for more security
});
const verifier = new Argon2Verifier({ workGenerator });

const app = express();
app.use(bodyParser.json());

// Make sure to rate limit api endpoint (use library express-rate-limit) else may overload server cpu usage
app.get('/pow/request', async (_, res) => {
  res.json(await verifier.generate());
});
app.post('/pow/verify', async (req, res) => {
  if (req.body && req.body.data && req.body.result) {
    if (await verifier.verify(req.body)) {
      res.status(204);
    } else {
      res.status(403);
    }
  } else {
    res.status(422);
  }
  res.end();
});
app.listen(3000);
```

#### Client

```ts
import { Argon2Worker } from 'pow-framework';

const worker = new Argon2Worker();
const request = await fetch('http://localhost:3000/pow/request').then((response) => response.json());
const result = await worker.work(request);

const init =  {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(result),
};
const statusCode = await fetch('http://localhost:3000/pow/verify', init).then((response) => response.status);
if (statusCode === 204) {
  // success
} else {
  // failed
}
```

## includes algorithms

- argon2d / argon2i / argon2id ( library argon2-browser )
- md5 ( library md5 )
