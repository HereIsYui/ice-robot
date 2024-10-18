import axios from "axios";
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
