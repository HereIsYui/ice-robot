import Fishpi, { ChatMsg } from "fishpi";

export default [{
  match: [/^菜单/],
  exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
    
    fishpi.chatroom.send(`测试新框架`);
  },
  enable: true,
}]