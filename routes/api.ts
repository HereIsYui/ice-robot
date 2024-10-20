import { getUser, updateUser } from '@lib/ice_fun';
import express from 'express';
import chat from '@/src/chat';

export const apiRouter = express.Router();

apiRouter.get('/GetUserIntimacy', async (req, res) => {
    let uid = req.query.uid ?? '';
    if (!uid) {
        res.status(400).send({ message: 'uid is required' })
    }
    const user = await getUser(uid.toString());
    res.send({ code: 0, data: { uId: uid, user: user?.user ?? '', intimacy: user?.intimacy ?? 0 }, msg: "success" });
})

apiRouter.get('/bribe', async (req, res) => {
    let uid = req.query.uid ?? '';
    let item = req.query.item ?? '';
    let num = parseInt(req.query.num?.toString() ?? "0");
    if (!uid) {
        res.status(400).send({ message: 'uid is required' })
    }
    const user = await getUser(uid.toString());
    let intimacy = (item == "鱼丸" ? 1 : 10) * num;
    user.intimacy += intimacy;
    await updateUser(user);
    let nick_name = user.nick_name ?? user.user;
    if (num <= 0) {
        chat.chatRoomSend(`@${user.user} 小气鬼${nick_name},一个${item}都不给我,小冰亲密度${intimacy}`);
    } else if (num <= 5) {
        chat.chatRoomSend(`@${user.user} 谢谢小气鬼${nick_name}送的${num}个${item},小冰亲密度+${intimacy}`);
    } else {
        chat.chatRoomSend(`@${user.user} 谢谢${nick_name}送的${num}个${item}:heartbeat:小冰亲密度+${intimacy}`);
    }
    res.send({ code: 0, msg: "success" });
})
