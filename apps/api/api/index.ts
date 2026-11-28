import { bootstrapApp } from "../src/bootstrap.js";

let appPromise: ReturnType<typeof bootstrapApp> | null = null;

const getApp = () =>
  (appPromise ??= bootstrapApp({ startBackgroundLoops: false }).catch((err: unknown) => {
    appPromise = null;
    throw err;
  }));

export default async function handler(req: Request): Promise<Response> {
  const { app } = await getApp();
  return app.fetch(req);
}
