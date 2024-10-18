import { initRedis } from "./../../../lib/redis";
import Fishpi, { ChatMsg, RedPacketType } from "fishpi";
import { getKey } from "@lib/redis";
import { addAdmin, addUserIntimacy, getAdmin, getUser, isAdmin, removeAdmin, updateUser } from "@lib/ice_fun";
import axios from "axios";
import config from "../../../config.json";
import { music163 } from "@lib/chat_fun";

export default [
  {
    match: [/.*/],
    exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
      if (["fishpi", "xiaoIce"].includes(userName)) return false;
    },
    enable: true,
    priority: 9999,
  },
  {
    match: [/.*/],
    exec: async ({ md, userName, userOId }: ChatMsg, fishpi: Fishpi) => {
      if (!md.startsWith("小冰")) return false;
      const user = await getUser(userOId, userName);
      if (user.user != userName) {
        user.user = userName;
        await updateUser(user);
      }
      if (user.intimacy && user.intimacy > 0 && user.today_intimacy < 20) {
        await addUserIntimacy(userOId, 1, true);
      }
    },
    enable: true,
    priority: 1000,
  },
  {
    match: [/^添加管理/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      let user = md.split(" ")[1];
      if (!user) {
        cb = "用户名不能为空";
      } else if (await isAdmin(userName)) {
        if (await addAdmin(user)) {
          cb = `添加成功`;
        } else {
          cb = `${user} 已经是管理员了`;
        }
      } else {
        cb = `管理员才可以进行此操作哦`;
      }
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/^取消管理/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      let user = md.split(" ")[1];
      if (!user) {
        cb = "用户名不能为空";
      } else if (await isAdmin(userName)) {
        if (await removeAdmin(user)) {
          cb = `取消成功`;
        } else {
          cb = `${user} 不是管理员哦`;
        }
      } else {
        cb = `管理员才可以进行此操作哦`;
      }
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/管理列表/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      if (await isAdmin(userName)) {
        cb = await getAdmin();
        await fishpi.chatroom.send(cb);
      } else {
        return false;
      }
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/^冰启鸽/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      if (await isAdmin(userName)) {
        axios({
          url: "https://chat.elves.online/super/reload",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: { s: config.robot.sevenSummer },
        });
        cb = "咦,凌不见了?我去找找~";
      } else {
        cb = `管理员才可以进行此操作哦`;
      }
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
  {
    match: [/^冰启凌/],
    exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
      let cb = "";
      if (await isAdmin(userName)) {
        axios({
          url: "https://red.iwpz.net/restart",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: { s: config.robot.b },
        });
        cb = "鸽鸽,等等我!";
      } else {
        cb = `管理员才可以进行此操作哦`;
      }
      await fishpi.chatroom.send(cb);
    },
    enable: true,
    priority: 1101,
  },
];
