# open-poen-frontend

# Running the open-poen-frontend locally

Before you begin, make sure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

You can verify if Node.js and npm are installed and check their versions by running the following commands in your terminal:

```bash
node -v
npm -v
```

## Clone the Repository
1. Clone the repository to your local machine using the following command:

`git clone https://github.com/Spheer-ai/open-poen-frontend.git`

2. Navigate to the project directory:

`cd open-poen-frontend`

3. Switch to the 'develop' branch:

`git checkout develop`

## Install Dependencies
1. Install the project dependencies using npm:

`npm install`

## Configure Vite (if necessary)
1. The project uses Vite for building the frontend and handling development. If you need to configure Vite settings, you can do so by editing the `vite.config.ts` file. In this file, you can specify the following:
    - **Host:** The development server's host is set to '127.0.0.1' in the Vite configuration.
    - **Port:** The development server's port is set to 8000 by default.
    - **API Connection:** To connect the frontend with the API, you can set up proxy configurations in vite.config.ts to forward API requests. Here's the proxy configuration from the project:

```typescript
export default {
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
```

## Start the Development Server
1. Build the frontend and connect it with the API via a proxy using Vite:

`npm rund dev`

This command will start the development server, and the open-poen-frontend will be available locally.

Note: The building process is handled by Vite, and any changes to the vite.config.ts file should be made before running the development server.

