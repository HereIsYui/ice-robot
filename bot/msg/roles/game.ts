import Fishpi, { ChatMsg, FingerTo, RedPacketType } from "fishpi";
import { getAdmin, getUser, isAdmin, removeAdmin } from "@lib/ice_fun";
import { getTianqi, music163 } from "@lib/chat_fun";
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
  {
    match: [/^小冰 \w*天气/],
    exec: async ({ md }: ChatMsg, fishpi: Fishpi) => {
      let cb = await getTianqi(md.replace("小冰", ""));
      await fishpi.chatroom.send(cb);
    },
    enable: true,
  },
  {
    match: [/^点歌 .{0,10}$/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = await music163(md.trim().split(" ")[1]);
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/(56c0f695|乌拉)/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      if (!["sevenSummer", "xiaoIce", "fishpi"].includes(userName)) {
        await fishpi.chatroom.send("![乌拉乌拉](https://pwl.stackoverflow.wiki/2022/03/image-56c0f695.png)");
      }
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/^TTS|^朗读/],
    exec: async ({ md }: ChatMsg, fishpi: Fishpi) => {
      const link =
        Buffer.from("aHR0cHM6Ly9kaWN0LnlvdWRhby5jb20vZGljdHZvaWNlP2xlPXpoJmF1ZGlvPQ==", "base64") + encodeURIComponent(md.replace(/^TTS|^朗读/i, ""));
      const cb = `那你可就听好了<br><audio src='${link}' controls/>`;
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
];
