import Fishpi, { ChatData } from "fishpi";

export default [
  {
    match: [/.*/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "hi~ 这里是小冰机器人🤖");
      return false;
    },
    enable: true,
    priority: -1000,
  },
];
