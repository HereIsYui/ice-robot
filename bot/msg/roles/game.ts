import Fishpi, { ChatMsg, FingerTo, RedPacket, RedPacketType } from "fishpi";
import { getAdmin, getUser, isAdmin, updateUser } from "@lib/ice_fun";
import { editUserBag, getTianqi, music163 } from "@lib/chat_fun";
import config from "../../../config.json";
import { getKey, setKey } from "@lib/redis";
import chat from "@/src/chat";

export default [
  {
    match: [/(来个|发个)红包/],
    exec: async ({ userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      let nameList = ["阿达", "老王", "鸽鸽", "午安", "勾月", "Yui", "跳跳", "墨夏", "柴柴", "哀酱", userName];
      let key = nameList[Math.floor(Math.random() * nameList.length)];
      let isSend = await getKey(`redpack:${userOId}`);
      if (await isAdmin(userName)) {
        if (isSend == true) {
          await chat.chatRoomSend(`@${userName} :已经发过红包了哦`);
        } else {
          await setKey(`redpack:${userOId}`, true, 86400);
          var redpacket: RedPacket = {
            type: RedPacketType.Specify,
            money: Math.floor(Math.random() * 64 + 32),
            count: 1,
            msg: "这是小冰的私房钱哦",
            recivers: [userName],
          };
          await fishpi.chatroom.redpacket.send(redpacket);
        }
      } else {
        if (isSend == true) {
          await chat.chatRoomSend(`@${userName} :已经发过红包了哦`);
        } else {
          let random = Math.floor(Math.random() * 99 + 1);
          if ([1, 11, 23, 55, 66, 88, 99].includes(random)) {
            await setKey(`redpack:${userOId}`, true, 86400);
            var redpacket: RedPacket = {
              type: RedPacketType.Specify,
              money: Math.floor(Math.random() * 32 + 32),
              count: 1,
              msg: "这是偷偷给你的哦,不要告诉别人",
              recivers: [userName],
            };
            await fishpi.chatroom.redpacket.send(redpacket);
          } else if (random == 6) {
            await setKey(`redpack:${userOId}`, true, 86400);
            var redpacket: RedPacket = {
              type: RedPacketType.Specify,
              money: Math.floor(Math.random() * 64 + 64),
              count: 1,
              msg: "🎉恭喜触发超级大红包~偷偷领哦",
              recivers: [userName],
            };
            await fishpi.chatroom.redpacket.send(redpacket);
          } else if (random < 15 || random > 90) {
            await FingerTo(config.keys.point).editUserPoints(userName, -10, "节操值爆表,扣除医药费~");
            await FingerTo(config.keys.point).editUserPoints("xiaoIce", 10, `${userName} 的节操值修复费用`);
            await chat.chatRoomSend(`@${userName} 不听不听🙉,节操值爆表,扣除医药费~`);
          } else {
            await chat.chatRoomSend(`@${userName} 不听不听🙉,${key}念经 \n > 本次节操:${random}`);
          }
        }
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/亲密度/],
    exec: async ({ userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      const user = await getUser(userOId, userName);
      await chat.chatRoomSend(`@${userName} 当前亲密度为: ${user.intimacy ?? 0}:two_hearts: \n > 召唤小冰,送鱼丸鱼翅,红包都可以增加亲密度哦`);
      return false;
    },
    enable: true,
  },
  {
    match: [/(当前|现在|今日|水多)(吗|少了)?(活跃)?值?$/],
    exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
      if (await isAdmin(userName)) {
        await chat.chatRoomSend(`凌 活跃`);
      } else {
        await chat.chatRoomSend(`凌 活跃  ${userName}`);
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/^小冰 .*天气/],
    exec: async ({ md }: ChatMsg, fishpi: Fishpi) => {
      let cb = await getTianqi(md.replace("小冰", "").trim());
      await chat.chatRoomSend(cb, true);
      return false;
    },
    enable: true,
  },
  {
    match: [/去打劫/],
    exec: async ({ userOId, userName }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      let liveness = 0;
      const user = await getUser(userOId, userName);
      if (user.last_liveness == 1) {
        cb = `@${userName} 小冰今天已经打劫过啦~ \n > 小冰打劫是领取昨日活跃哦, 让小冰帮你领取有概率获得免签卡碎片~`;
        await chat.chatRoomSend(cb);
        return false;
      }
      try {
        liveness = await FingerTo(config.keys.liveness).getYesterDayLivenessReward(userName);
      } catch (error) {}
      if (liveness == 0) {
        cb = `@${userName} ` + "今日已经领过活跃啦! 不可以重复领取哦 \n > 小冰打劫是领取昨日活跃哦, 让小冰帮你领取有概率获得免签卡碎片~";
        await chat.chatRoomSend(cb);
        return false;
      }
      cb = `@${userName} 小冰打劫回来啦！一共获得了${liveness >= 0 ? liveness + "点积分:credit_card:" : "0点积分, 不要太贪心哦~"}`;
      const toDaySeed = parseInt((Math.random() * 100).toString());
      if (toDaySeed <= 40) {
        cb += "\n 🎉🎉🎉鸿运当头🎉🎉🎉 \n ";
        cb += "嘻嘻,小冰骗你的~小冰什么都没捡到哦";
        cb += "\n > 发送`小冰 背包`可以查看当前背包信息";
      } else if (toDaySeed <= 65) {
        cb += "\n 🎉🎉🎉鸿运当头🎉🎉🎉 \n ";
        cb += `${userName}! ${userName}! 小冰捡到了\`免签卡碎片\`一张,已经放入${userName}的背包啦~`;
        cb += "\n > 发送`小冰 背包`可以查看当前背包信息";
        await editUserBag({ item: "免签卡碎片", num: 1 }, user);
      } else if (toDaySeed < 90) {
        cb += `\n ${userName}! ${userName}! 我在路上看到阿达了,还给我了一张签名照。`;
        await editUserBag({ item: "阿达的签名照", num: 1 }, user);
      } else {
        cb += `\n ${userName}! ${userName}! 凌被妖怪抓走了(╥╯^╰╥) 快v我50去报警`;
      }
      if (user.intimacy > 20480) {
        let redpack = parseInt((Math.random() * 100).toString());
        cb += `\n\n ${userName}! 俺打劫回来啦! 额外抢到了${redpack}积分~`;
      }
      user.last_liveness = 1;
      await updateUser(user);
      await chat.chatRoomSend(cb);
      return false;
    },
    enable: true,
  },
  {
    match: [/补发 .{0,10}$/],
    exec: async ({ userName, md, userOId }: ChatMsg, fishpi: Fishpi) => {
      if (await isAdmin(userName)) {
        let itemStr = md.trim().split(" ")[1];
        let users = itemStr.split("_")[0];
        let item = itemStr.split("_")[1];
        const fishpiUser = await fishpi.user(users);
        const user = await getUser(fishpiUser.oId);
        await editUserBag({ item, num: 1 }, user);
        await chat.chatRoomSend(`@${userName} 给\`${users}\` 补发了${item}`);
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/^点歌 .{0,10}$/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = await music163(md.trim().split(" ")[1]);
      await chat.chatRoomSend(cb, true);
      return false;
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/(56c0f695|乌拉)/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      if (!["sevenSummer", "xiaoIce", "fishpi"].includes(userName)) {
        await chat.chatRoomSend("![乌拉乌拉](https://pwl.stackoverflow.wiki/2022/03/image-56c0f695.png)");
      }
      return false;
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/^TTS|^朗读/],
    exec: async ({ md, userName }: ChatMsg, fishpi: Fishpi) => {
      const link =
        Buffer.from("aHR0cHM6Ly9kaWN0LnlvdWRhby5jb20vZGljdHZvaWNlP2xlPXpoJmF1ZGlvPQ==", "base64") + encodeURIComponent(md.replace(/^TTS|^朗读/i, ""));
      const cb = `@${userName} 那你可就听好了<br><audio src='${link}' controls/>`;
      await chat.chatRoomSend(cb);
      return false;
    },
    enable: true,
    priority: 1101,
  },
];
