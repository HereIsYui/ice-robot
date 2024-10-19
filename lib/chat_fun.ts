import axios from "axios";
import city from "../city.json";
import config from "../config.json";
import { updateUser } from "./ice_fun";
export async function music163(msg: string) {
  try {
    const res = await axios({
      method: "POST",
      headers: {
        Host: "music.163.com",
        Origin: "http://music.163.com",
        "user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        referer: "http://music.163.com/search/",
      },
      url: `http://music.163.com/api/search/get/web?csrf_token&hlpretag&hlposttag&s=${msg}&type=1&offset=0&total=true&limit=1`,
    });
    let mid = res.data.result.songs[0].id;
    const info = await axios({
      method: "GET",
      headers: {
        Host: "music.163.com",
        Origin: "http://music.163.com",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        referer: "http://music.163.com/search/",
      },
      url: `http://music.163.com/api/song/detail/?id=${mid}&ids=%5B${mid}%5D`,
    });
    let cb = `[music]{"title": "${info.data.songs[0].name}", "coverURL": "${info.data.songs[0].album.picUrl}", "source": "http://music.163.com/song/media/outer/url?id=${mid}","type":"music","from":""}[/music]`;
    return cb;
  } catch (error) {
    return "你丫的这首歌太难找了!换一个!";
  }
}

export const getTianqi = async function (msg: string): Promise<string> {
  return await new Promise(async (resolve, reject) => {
    const dateReg = /(今天|明天|后天|大后天)*天气/;
    const date = (msg.match(dateReg) ?? "")[1];
    let adr = "";
    if (date) {
      adr = msg.substring(0, msg.indexOf(date));
    } else {
      adr = msg.substring(0, msg.indexOf("天气"));
    }
    if (!adr) {
      resolve("你查询了一个寂寞~ \n 天气指令：小冰 地点[时间]天气");
    }
    const vals = city.find((e) => e.addr.indexOf(adr) > -1);
    if (vals == null) {
      resolve(`未查询到地点：${adr}`);
    } else {
      try {
        const res = await axios({
          method: "get",
          url: `https://api.caiyunapp.com/v2.5/${config.weather.key}/${vals.long},${vals.lat}/weather.json?alert=true`,
        });
        if (res.data.status == "ok") {
          try {
            const weatherData = res.data.result;
            const weather = weatherData.daily.temperature;
            const weatherCode = weatherData.daily.skycon;
            let msg = "";
            const date = [];
            const weatherCodeList = [];
            const max = [];
            const min = [];
            for (let i = 0; i < 5; i++) {
              const ndate = new Date(weather[i].date);
              const m = ndate.getMonth() + 1;
              const d = ndate.getDate();
              date.push(`${m}/${d}`);
              weatherCodeList.push(weatherCode[i].value);
              max.push(weather[i].max);
              min.push(weather[i].min);
            }
            msg = `[weather]{"type":"weather","date":"${date.join(",")}","weatherCode":"${weatherCodeList.join(",")}","max":"${max.join(
              ","
            )}","min":"${min.join(",")}","t":"${adr}","st":"${weatherData.forecast_keypoint}"}[/weather]`;
            resolve(msg);
          } catch (e) {
            resolve("小冰的天气接口出错了哦~");
          }
        } else {
          resolve("小冰的天气接口出错了哦~");
        }
      } catch (error) {
        resolve("小冰的天气接口出错了哦~");
      }
    }
  });
};

export async function editUserBag(data: any, user?: any) {
  let cb = { code: 0, msg: "成功" };
  const uBag = JSON.parse(user.bag ?? "[]");
  if (uBag.length == 0) {
    if (data.num < 0) {
      return { code: 1, msg: "你还没有该物品" };
    }
    uBag.push({ name: data.item, num: data.num });
  } else {
    let hasItem: boolean = false;
    uBag.forEach((i: any) => {
      if (i.name == data.item) {
        hasItem = true;
        if (i.num + data.num < 0) {
          cb = { code: 1, msg: "物品数量不足" };
        } else {
          i.num += data.num;
          cb = { code: 0, msg: "成功" };
        }
      }
    });
    if (!hasItem) {
      if (data.num < 0) return { code: 1, msg: "你还没有该物品" };
      uBag.push({ name: data.item, num: data.num });
    }
    user.bag = JSON.stringify(uBag);
    await updateUser(user);
  }
  return cb;
}