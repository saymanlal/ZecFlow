import { serve } from "@hono/node-server";
import { bootstrapApp } from "./bootstrap.js";

const { app, env, store, indexer, rpc, fundingRpc, maintenance } = await bootstrapApp({
  startBackgroundLoops: true,
});

const server = serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST }, (info) => {
  process.stdout.write(`ZecFlow API listening on http://${info.address}:${String(info.port)}\n`);
});

for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.on(signal, () => {
    if (maintenance) clearInterval(maintenance);
    indexer.stop();
    rpc.stop();
    fundingRpc.stop();
    server.close(() => {
      void store.close().then(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  });
