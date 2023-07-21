# trusted-setup-web-app
A frontend application to run trusted setup contributions written in [Typescript](https://www.typescriptlang.org/) and [React](https://es.react.dev/).

## Code distribution

### Routes
This frontend app uses [Vite](https://vitejs.dev/) and [React Router](https://reactrouter.com/en/main) to serve a single page application with multiple routes depending on the state of the ceremony. To read the code and understand how it works you can start on the `/src/router/router.tsx` and checkout each component that represents a specific state of the ceremony:

1. **Home page:** visitors and participants learn about the ceremony
2. **Sign in page:** participants sign in and generate entropy
3. **Wait page:** participants wait for their turn to contribute
4. **Contribute page:** participants compute their contribution
5. **Complete page:** participants can checkout their contributions and from others.

These components are located in the `/src/pages` directory.

### Stores
The server session token, user id, generated entropy and other useful data is store in the `/src/stores` directory. The authentication data is preserved in localStorage so if users close their tabs they could teoretically come back and continue contributing (if their turn or the keep alive interval has not passed away).

### API
All the code required to interact with the backend is located at `/src/api`. There are two main files: `http.ts` and `ws.ts` because of the different ways the server sends data to clients.

### Components
Reusable components have been separated in different subdirectories inside `/src/components` so they can be shared across the frontend.

### Styles
Each component is built using [styled components](https://styled-components.com/) and the CSS code is located inside each component `.tsx` file. There is a global `/src/styles.ts` file that contains the global colors, fonts and style configurations.

### Environment variables
The environment variables are located in the `.env` file. The `VITE_` prefix is required so they can be exposed in the frontend code (visible to anyone on the internet). The `vite-env.d.ts` allows to declare the variables and their type.