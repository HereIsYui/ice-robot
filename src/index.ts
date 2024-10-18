import chat from "./chat";
import config from "../config.json";
import bots from "@bot/index";
import { getKey, setKey } from "lib/redis";

(async function main() {
  try {
    await chat.login(config);
    await chat.listen(bots);
    const admin = await getKey("admin");
    if (!admin) {
      await setKey("admin", ["Yui", "adlered"]);
    }
  } catch (error) {
    console.error(error);
  }
})();
