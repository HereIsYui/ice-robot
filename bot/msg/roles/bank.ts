import Fishpi, { ChatMsg, FingerTo, RedPacketType } from "fishpi";
import { timeout } from "@/config.json";
import { getUser, updateUser } from "@lib/ice_fun";
import { setKey } from "@lib/redis";
import config from "../../../config.json";

export default [
  {
    match: [/(账户|余额)/],
    exec: async ({ userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      const user = await getUser(userOId, userName);
      await fishpi.chatroom.send(
        `@${userName} 您的账户余额为:${user.point.toString().replaceAll(/\d/gi, "*")} \n > 为了保护您的隐私,聊天室内仅展示位数,请在私聊中查询`
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/存款? \d{0,9}$/],
    exec: async ({ userName, md, userOId }: ChatMsg, fishpi: Fishpi) => {
      const point = parseInt(md.replace("小冰", "").trim().split(" ")[1]);
      if (point <= 0) {
        await fishpi.chatroom.send(`@${userName} 交易金额不合法`);
        return false;
      }
      console.log(point);
      const { userPoint, userNo } = await fishpi.user(userName);
      const user = await getUser(userOId, userName);
      if (userPoint - point >= 0) {
        let no = userNo.toString() + new Date().getTime().toString();
        let memo = "【IceBank-交易通知】交易单号:" + no + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(userName, -point, memo);
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
        await fishpi.chatroom.send(`@${userName} 成功存 ${point}积分,当前积分:${user.point} \n > ${memo}`);
      } else {
        await fishpi.chatroom.send(`@${userName} 积分不足`);
        return false;
      }
      return false;
    },
    enable: true,
  },
  {
    match: [/取款? \d{0,9}$/],
    exec: async ({ userName, md, userOId }: ChatMsg, fishpi: Fishpi) => {
      const point = parseInt(md.replace("小冰", "").trim().split(" ")[1]);
      if (point <= 0) {
        await fishpi.chatroom.send(`@${userName} 金额不合法`);
        return false;
      }
      const user = await getUser(userOId, userName);
      const { userNo } = await fishpi.user(userName);
      if (user.point - point >= 0) {
        let no = userNo.toString() + new Date().getTime().toString();
        let memo = "【IceBank-交易通知】交易单号:" + no + ";PS:交易记录只保存7天";
        await FingerTo(config.keys.point).editUserPoints(userName, point, memo);
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
        await fishpi.chatroom.send(`@${userName} 成功取 ${point}积分,当前积分:${user.point} \n > ${memo}`);
      } else {
        await fishpi.chatroom.send(`@${userName} 积分不足`);
        return false;
      }
      return false;
    },
    enable: true,
  },
];
