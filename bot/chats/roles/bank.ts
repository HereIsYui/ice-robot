import Fishpi, { ChatData, FingerTo } from "fishpi";
import config from "../../../config.json";
import { getUser, updateUser } from "@lib/ice_fun";
import { setKey } from "@lib/redis";

export default [
  {
    match: [/存款? \d{0,9}$/],
    exec: async ({ senderUserName, markdown, fromId }: ChatData, fishpi: Fishpi) => {
      const point = parseInt(markdown.split(" ")[1]);
      if (point <= 0) {
        await fishpi.chat.send(senderUserName, `金额不合法`);
        return false;
      }
      await fishpi.chat.send(senderUserName, `交易中...请稍后....`);
      const { userPoint, userNo } = await fishpi.user(senderUserName);
      const user = await getUser(fromId, senderUserName);
      if (userPoint - point >= 0) {
        let no = userNo.toString() + new Date().getTime().toString();
        let memo = "【IceBank-交易通知】交易单号:" + no + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(senderUserName, -point, memo);
        await FingerTo(config.keys.point).editUserPoints("xiaoIce", point, memo);
        user.point = (user.point ?? 0) + point;
        await updateUser(user);
        await setKey(
          `BANK:${no}`,
          {
            point: point,
            uId: user.uId,
            time: Date.now(),
            type: 0,
            memo: memo,
          },
          604800
        );
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
      await fishpi.chat.send(senderUserName, `交易中...请稍后....`);
      const user = await getUser(fromId, senderUserName);
      const { userNo } = await fishpi.user(senderUserName);
      if (user.point - point >= 0) {
        let no = userNo.toString() + new Date().getTime().toString();
        let memo = "【IceBank-交易通知】交易单号:" + no + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(senderUserName, point, memo);
        await FingerTo(config.keys.point).editUserPoints("xiaoIce", -point, memo);
        user.point = (user.point ?? 0) - point;
        await updateUser(user);
        await setKey(
          `BANK:${no}`,
          {
            point: point,
            uId: user.uId,
            time: Date.now(),
            type: 1,
            memo: memo,
          },
          604800
        );
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
