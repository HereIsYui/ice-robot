import Fishpi, { ChatMsg, RedPacket } from "fishpi";
import { getRecord, guess, result, success, failed } from "@lib/guess";

const rps = [ '石头', '剪刀', '布' ];

let timer :NodeJS.Timeout | null = null;
let fight :NodeJS.Timeout | null = null;

export default {
  exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
  },
  enable: false,
}