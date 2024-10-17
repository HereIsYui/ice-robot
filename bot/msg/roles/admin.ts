import Fishpi, { ChatMsg, RedPacketType } from "fishpi";

export default [{
  match: [/^小冰/, /去打劫/],
  exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
    
  },
  enable: true,
}]