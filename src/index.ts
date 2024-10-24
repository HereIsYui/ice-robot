import chat from "./chat";
import config from "../config.json";
import bots from "@bot/index";
import express from "express";
import { apiRouter } from "@/routes/api";
const app = express();
const port = 3010;

app.use("/api", apiRouter);
app.use(express.static('public'));

(async function main() {
  try {
    await chat.login(config);
    await chat.listen(bots);
    app.all("*", function (req, res, next) {
      //设为指定的域
      res.header("Access-Control-Allow-Origin", "*");
      // 这里设置允许跨域的域名，*代表所有↑↑↑↑↑↑↑↑↑↑↑↑
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("X-Powered-By", " 3.2.1");
      next();
    });
    app.listen(port, () => {
      console.log("IceNet3.0 start at 3010");
    });
  } catch (error) {
    console.error(error);
  }
})();
