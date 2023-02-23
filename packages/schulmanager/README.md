# Schulmanager

## Library to interact with schulmanager-online.de

## 💻 Install

```bash
yarn add schulmanager
```

## 🚀 Usage

```ts
import { batchRequest, get, login } from "schulmanager";

const { token } = await login('email', 'password');

const loginStatus = await getLoginStatus(token);

const response = await batchRequest(token, [
  get('letters:get-letters'),
  get('null:get-current-term'),
  get('schedules:get-actual-lessons', {
    start: '2020-01-01',
    end: '2020-12-31',
    student: { id: loginStatus.data.associatedStudent.id }
  })
] as const);
```

## 📖 Documentation

Documentation is available at [kc-schulmanager-docs.netlify.app](https://kc-schulmanager-docs.netlify.app/)

Documentation for WebSocket is available at [types/models.WebSocket](https://kc-schulmanager-docs.netlify.app/types/models.WebSocket)

## ⚠️ Disclaimer

This library is not affiliated with schulmanager-online.de in any way. It is not supported by schulmanager-online.de and you use it at your own risk.

Please use this library responsibly and do not abuse it.

API can change at any time and this library might not work anymore.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
