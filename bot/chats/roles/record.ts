import Fishpi, { ChatData } from "fishpi";
import { getRecord } from "@lib/guess";

export default [
  {
    match: [/.+/],
    exec: async ({ markdown, senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "hi~ 这里是冰冰");
    },
    enable: true,
  },
];
