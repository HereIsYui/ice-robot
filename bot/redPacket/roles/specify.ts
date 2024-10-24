import { addUserIntimacy } from "@lib/ice_fun";
import Fishpi, { ChatMsg, RedPacket } from "fishpi";

let loginUser: string | null = null;
export default {
  async exec({ content: redpack, userName, oId, userOId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;
    if (!loginUser) loginUser = await fishpi.account.info().then((data: any) => data.data.userName);
    if (redpack.money <= 0) return;
    if (!redpack.recivers?.includes(loginUser!)) return;
    if (redpack.recivers[0] == "xiaoIce") {
      fishpi.chatroom.redpacket.open(oId);
      let intimacy = Math.floor(redpack.money / 10);
      fishpi.chatroom.send(`@${userName} 谢谢${userName}的红包~小冰亲密度+${intimacy}`);
      await addUserIntimacy(userOId, intimacy, false);
    } else {
      setTimeout(() => {
        fishpi.chatroom.redpacket.open(oId);
      }, 3000);
    }
  },
  enable: true,
};
