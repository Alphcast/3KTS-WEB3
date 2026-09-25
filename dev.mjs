import { createServer } from 'vite';

async function start() {
  const port = 3000;
  const server = await createServer({
    configFile: './vite.config.js',
    root: process.cwd(),
    server: {
      port,
      host: '0.0.0.0',
    },
  });
  await server.listen();
  server.printUrls();
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
