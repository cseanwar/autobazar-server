import app, { init } from "../src/index.js";

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await init();
    initialized = true;
  }

  app(req, res);

  if (res.writableFinished || res.finished) return;

  await new Promise<void>((resolve, reject) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);
  });
}