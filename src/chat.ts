import Fishpi, { ClientType, NoticeMsg } from "fishpi";
import { domain } from "../config.json";
import fetch from "node-fetch";
import { Robots } from "@bot/index";
import * as Schedule from "@schedule/index";

const fishpi = new Fishpi();
fishpi.setDomain(domain);
globalThis.fetch = fetch as any;

export default {
  async login(config: any) {
    if (config.token) await fishpi.setToken(config.token);
    else if (config.username && config.passwd) await fishpi.login(config);
    else throw new Error("请提供 token 或者用户名密码");

    const rsp = await fishpi.account.info();
    if (rsp.code) throw new Error(`登录失败：${rsp.msg}`);
    const user = rsp.data!;
    console.log(`登录成功：${user.userName}`);
  },

  async listen(bots: Robots) {
    console.log("聊天室监听中...");
    fishpi.chatroom.setVia(ClientType.IceNet, "3.0");
    // 监听聊天室消息
    await fishpi.chatroom.addListener(async ({ msg }) => {
      if (!bots[msg.type]) return;

      const { exec } = bots[msg.type];
      if (!exec) return;

      exec(msg, fishpi);
    });

    fishpi.chatroom.send("当当当当,冰冰来喽~");

    fishpi.chat.addListener(async ({ msg }) => {
      const chat = msg as NoticeMsg;
      if (chat.command != "newIdleChatMessage") return;
      const { data: chats } = await fishpi.chat.get({ user: chat.senderUserName!, size: 2 });
      const chatData = chats?.find((chat) => chat.preview == chat.preview);
      if (bots.chats?.exec && chatData) bots.chats?.exec(chatData, fishpi);
    });

    Schedule.load(fishpi);
  },

  async chatRoomSend(msg: string, isPre: boolean = false) {
    if(isPre){
      await fishpi.chatroom.send(msg);
    }else{
      msg += `<div id="IceNet-${new Date().getTime()}"></div>`;
      await fishpi.chatroom.send(msg);
    }
    
  },
};
