# Schulmanager

## Library to interact with schulmanager-online.de

## 💻 Install

```bash
yarn add schulmanager
```

## 🚀 Usage

```ts
import { getLoginStatus, login } from "schulmanager";

const { token } = await login("email", "password");
const loginStatus = await getLoginStatus(token);
```

## 📖 Documentation

Documentation is available at [kc-schulmanager-docs.netlify.app](https://kc-schulmanager-docs.netlify.app/)

## ⚠️ Disclaimer

This library is not affiliated with schulmanager-online.de in any way. It is not supported by schulmanager-online.de and you use it at your own risk.

Please use this library responsibly and do not abuse it.

API can change at any time and this library might not work anymore.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
