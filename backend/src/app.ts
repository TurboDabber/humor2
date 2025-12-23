import express from "express";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_, res) => res.status(200).json({ ok: true }));

  return app;
};
