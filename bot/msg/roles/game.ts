import Fishpi, { ChatMsg, FingerTo, RedPacketType } from "fishpi";
import { getAdmin, getUser, isAdmin, removeAdmin } from "@lib/ice_fun";
export default [
  {
    match: [/^小冰 (来个|发个)红包/],
    exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
      let adminList = await getAdmin();
      let nameList = ["阿达", "老王", "鸽鸽", "午安", ...adminList.split(",")];
      let key = nameList[Math.floor(Math.random() * nameList.length)];
      await fishpi.chatroom.send(`@${userName} 不听不听🙉,${key}念经`);
    },
    enable: true,
  },
  {
    match: [/^小冰 亲密度/],
    exec: async ({ userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      const user = await getUser(userOId, userName);
      await fishpi.chatroom.send(`@${userName} 当前亲密度为: ${user.intimacy ?? 0}:two_hearts: \n > 召唤小冰,送鱼丸鱼翅,红包都可以增加亲密度哦`);
    },
    enable: true,
  },
  {
    match: [/(当前|现在|今日|水多)(吗|少了)?(活跃)?值?$/],
    exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
      if (await isAdmin(userName)) {
        await fishpi.chatroom.send(`凌 活跃`);
      } else {
        await fishpi.chatroom.send(`凌 活跃  ${userName}`);
      }
    },
    enable: true,
  },
];
