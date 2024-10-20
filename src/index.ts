import chat from "./chat";
import config from "../config.json";
import bots from "@bot/index";
import { getKey, setKey } from "lib/redis";
import express from "express";
import { apiRouter } from "@/routes/api";
const app = express();
const port = 3000;

app.use('/api', apiRouter);

(async function main() {
  try {
    await chat.login(config);
    await chat.listen(bots);
    app.listen(port, () => {
      console.log(`IceNet 已启动,监听端口:${port}`);
    })
  } catch (error) {
    console.error(error);
  }
})();
