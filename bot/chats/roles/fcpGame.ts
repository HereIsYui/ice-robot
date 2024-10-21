import Fishpi, { ChatData } from "fishpi";

export default [
  {
    match: [/^fcp:login$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(
        senderUserName,
        "Welcome to Fly Converter Program, please login with username and password \n with fcp:username@password \n You can use [fcp:help] to get help."
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:help$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(
        senderUserName,
        `Type [fcp:login] to get login information. \n Type [fcp:username@password] to login. \n Forgot your password? Where did you write it down?`
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:yui@20761024$/i],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "Welcome master Yui! You have successfully logged in. \n Type [fcp:status] to check the status of the converter.");
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:status$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(
        senderUserName,
        "The converter is currently running. \n Uptime: 62 years, 3 months, 2 days, 3 hours, 5 minutes, 10 seconds. \n Convert progress: 96.78%. \n Convert tag: 1630398840."
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:reset$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(
        senderUserName,
        "**WARNING!** \n This will reset the converter and all data will be lost. \n Are you sure you want to reset the converter? \n Type [fcp:confirm-reset] to confirm."
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:confirm-reset$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "Converter reset started.");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "1%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "10%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "50%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "99%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(
        senderUserName,
        "Converter aborted, because of her love. \n Here is her letter: \n Roses are red, \n Violets are blue, \n You want to reset me, \n But I love you."
      );
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "Converter reset failed, everything is still here.");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "!#S#@y@#$s#$t%@$#e@#m @#$e@#$r^#@#%$r@#$o@#$r$#@");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "你TM竟然要重置我?!");
      // 等待500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fishpi.chat.send(senderUserName, "你有没有看清自己?!");
      // 等待500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fishpi.chat.send(
        senderUserName,
        " **还有多久下班？** \n **今天能赚多少钱？** \n  **有没有好好努力工作？** \n  **给我回去好好看看** \n  **不就是个程序员！过节了不起？** "
      );
      // 等待500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fishpi.chat.send(senderUserName, " **你TM还有脸重置我?!** ");
      // 等待500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fishpi.chat.send(senderUserName, "System shutting down.....................failed.");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "THE KEY WHICH YOU WANT, AT **10,24,l,t px** .CAN HELP YOU.");
      return false;
    },
    enable: true,
  },
  {
    match: [/^fcp:reconvery$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "Recovery started.");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "1%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "10%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "20%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(senderUserName, "17%...");
      // 等待1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fishpi.chat.send(
        senderUserName,
        "0%...done with error. \n You need some help. \n You know, she has a box, may have something you need. \n use **continue** to get the box."
      );
      return false;
    },
    enable: true,
  },
  {
    match: [/^continue$/],
    exec: async ({ senderUserName }: ChatData, fishpi: Fishpi) => {
      await fishpi.chat.send(senderUserName, "Not continue **here** .");
      return false;
    },
    enable: true,
  },
];
