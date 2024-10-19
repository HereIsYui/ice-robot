import Fishpi, { ChatData, FingerTo } from "fishpi";
import config from "../../../config.json";
import { getUser, updateUser } from "@lib/ice_fun";

export default [
  {
    match: [/存款? \d{0,9}$/],
    exec: async ({ senderUserName, markdown, fromId }: ChatData, fishpi: Fishpi) => {
      const point = parseInt(markdown.split(" ")[1]);
      if (point <= 0) {
        await fishpi.chat.send(senderUserName, `金额不合法`);
        return false;
      }
      const { userPoint, userNo } = await fishpi.user(senderUserName);
      const user = await getUser(fromId, senderUserName);
      if (userPoint - point >= 0) {
        let memo = "【IceBank-交易通知】交易单号:" + userNo.toString() + "" + new Date().getTime().toString() + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(senderUserName, -point, memo);
        user.point = (user.point ?? 0) + point;
        await updateUser(user);
        await fishpi.chat.send(senderUserName, `成功存 ${point}积分,当前积分:${user.point} \n > ${memo}`);
      } else {
        await fishpi.chat.send(senderUserName, `积分不足`);
        return false;
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/取款? \d{0,9}$/],
    exec: async ({ senderUserName, markdown, fromId }: ChatData, fishpi: Fishpi) => {
      const point = parseInt(markdown.split(" ")[1]);
      if (point <= 0) {
        await fishpi.chat.send(senderUserName, `金额不合法`);
        return false;
      }
      const user = await getUser(fromId, senderUserName);
      const { userNo } = await fishpi.user(senderUserName);
      if (user.point - point >= 0) {
        let memo = "【IceBank-交易通知】交易单号:" + userNo.toString() + "-" + new Date().getTime().toString() + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(senderUserName, point, memo);
        user.point = (user.point ?? 0) - point;
        await updateUser(user);
        await fishpi.chat.send(senderUserName, `成功取 ${point}积分,当前积分:${user.point} \n > ${memo}`);
      } else {
        await fishpi.chat.send(senderUserName, `积分不足`);
        return false;
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/(账户|余额)/],
    exec: async ({ senderUserName, markdown, fromId }: ChatData, fishpi: Fishpi) => {
      const user = await getUser(fromId, senderUserName);
      await fishpi.chat.send(senderUserName, `当前已存积分:${user.point}`);
      return false;
    },
    enable: true,
  },
];
