# WebSocket

## Important

Only use socket.io client version 2, other won't work.

Best way is to install it with `yarn add socket.io-client@v2-latest`.

Or using [Documentation](https://socket.io/docs/v2/client-installation/).

## How to connect - Example

```ts
import { batchRequest, get } from "schulmanager";
import io from 'socket.io-client';

// Follow README to get token

const response = await batchRequest(token, [
  get('null:get-websocket-push-url'),
] as const);

const socket = io(response.results[0]);
```
