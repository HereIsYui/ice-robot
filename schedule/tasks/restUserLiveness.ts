import { getUser, updateUser } from "@lib/ice_fun";
import { getKey, getKeys } from "./../../lib/redis";
import Fishpi from "fishpi";
export default {
  name: "重置用户活跃和亲密度",
  /**
   * 任务执行时间
   */
  time: "00:00:00",
  /**
   * 任务执行
   * @param fireDate 任务执行时间
   * @param fishpi FishPi实例
   */
  async exec(fireDate: Date, fishpi: Fishpi) {
    let users = await getKeys("UID:*");
    for (let i = 0; i < users.length; i++) {
      let user = await getUser(users[i].split(":")[1]);
      user.last_liveness = 0;
      user.today_intimacy = 0;
      await updateUser(user);
    }
    await fishpi.chat.send("Yui", "更新用户信息成功!");
  },
  /**
   * 是否启用
   */
  enable: true,
};
