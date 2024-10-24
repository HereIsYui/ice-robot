import Fishpi, { ChatMsg, FingerTo, RedPacketType } from "fishpi";
import { getUser, updateUser } from "@lib/ice_fun";
import config from "../../../config.json";
import { editUserBag } from "@lib/chat_fun";
import chat from "@/src/chat";
export default [
  {
    match: [/^小冰 背包$/],
    exec: async ({ userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      const user = await getUser(userOId);
      const uBag = JSON.parse(user.bag ?? "[]");
      if (uBag.length == 0) {
        cb += "\n > 你瞅了瞅你的背包, 忍不住高歌一曲";
        cb +=
          '\n <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=2005811997&auto=0&height=66"></iframe>';
      } else {
        cb += "当前存货:";
        uBag.forEach((i: any) => {
          if (i.num > 0) cb += `\n \`${i.name}\`*${i.num}个`;
        });
        let fishpiBag = await FingerTo(config.keys.item).queryUserBag(userName);
        if (fishpiBag.code == 0) {
          if (fishpiBag.data.checkin1day) cb += `\n \`免签卡\`*${fishpiBag.data.checkin1day}个`;
          if (fishpiBag.data.checkin2days) cb += `\n \`两日免签卡\`*${fishpiBag.data.checkin2days}个`;
          if (fishpiBag.data.patchCheckinCard) cb += `\n \`补签卡\`*${fishpiBag.data.patchCheckinCard}个`;
          if (fishpiBag.data.metalTicket) cb += `\n \`摸鱼派一周年纪念勋章领取券\`*${fishpiBag.data.metalTicket}个`;
        }
      }
      await chat.chatRoomSend(`@${userName} ` + cb);
      return false;
    },
    enable: true,
  },
  {
    match: [/兑换 .{0,5}$/],
    exec: async ({ userName, md, userOId }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      const item = md.replace("小冰", "").trim().split(" ")[1];
      if (!["免签卡", "免签卡碎片"].includes(item)) {
        return "啊啊啊 小冰没有这个道具啊";
      }
      let isOk = null;
      const user = await getUser(userOId);
      switch (item) {
        case "免签卡":
          isOk = await editUserBag({ item: "免签卡碎片", num: -3 }, user);
          isOk.code == 0 && (await FingerTo(config.keys.item).editUserBag(userName, "checkin1day", 1));
          cb = isOk.code == 0 ? "兑换成功" : isOk.msg;
          break;
        case "免签卡碎片":
          isOk = await editUserBag({ item: "阿达的签名照", num: -3 }, user);
          isOk.code == 0 && (await editUserBag({ item: "免签卡碎片", num: 1 }, user));
          cb = isOk.code == 0 ? "兑换成功" : isOk.msg;
          break;
        default:
          break;
      }
      await chat.chatRoomSend(`@${userName} ` + cb);
      return false;
    },
    enable: true,
  },
  {
    match: [/使用 .{0,5}$/],
    exec: async ({ userName, md, userOId }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      const msg = md.replace("小冰", "").trim().split(" ")[1].split("_");
      const item = msg[0];
      const num = msg[1];
      if (!["免签卡", "免签卡碎片"].includes(item)) {
        return "啊啊啊 小冰没有这个道具啊";
      }
      let itemKey = config.keys.item;
      let fishpiBag = await FingerTo(itemKey).queryUserBag(userName);
      // 检查用户道具数量
      switch (item) {
        case "免签卡":
          if (fishpiBag.data.checkin1day >= num) {
            await FingerTo(itemKey).editUserBag(userName, "checkin1day", -parseInt(num));
            await FingerTo(itemKey).editUserBag(userName, "sysCheckinRemain", parseInt(num));
            cb = `使用${num}张${item}成功~不在的时候,记得想我哦:heartpulse:`;
          } else {
            cb = "物品数量不足:cupid:";
          }
          break;
        case "两日免签卡":
          if (fishpiBag.data.checkin2days >= num) {
            await FingerTo(itemKey).editUserBag(userName, "checkin2days", -parseInt(num));
            await FingerTo(itemKey).editUserBag(userName, "sysCheckinRemain", parseInt(num) * 2);
            cb = `使用${num}张${item}成功~不在的时候,记得想我哦:two_hearts:`;
          } else {
            cb = "物品数量不足:cupid:";
          }
          break;
        default:
          cb = "没有该物品哦";
          break;
      }
      await chat.chatRoomSend(`@${userName} ` + cb);
      return false;
    },
    enable: true,
  },
];
