import app, { init } from "../src/index.js";

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await init();
    initialized = true;
  }
  return app(req, res);
}