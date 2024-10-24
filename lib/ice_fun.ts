import { delKey, getKey, setKey } from "./redis";
export async function isAdmin(userName: string) {
  const adminList = await getKey("admin");
  if (adminList && adminList.includes(userName)) {
    return true;
  } else {
    return false;
  }
}

export async function addAdmin(userName: string) {
  const adminList = await getKey("admin");
  if (adminList && !adminList.includes(userName)) {
    await setKey("admin", [...adminList, userName]);
    return true;
  } else {
    return false;
  }
}

export async function removeAdmin(userName: string) {
  const adminList = await getKey("admin");
  if (adminList && adminList.includes(userName)) {
    await setKey(
      "admin",
      adminList.filter((name: string) => name !== userName)
    );
    return true;
  } else {
    return false;
  }
}

export async function getAdmin() {
  const adminList = await getKey("admin");
  return adminList.join(",");
}

export async function getUser(oId: string, userName?: string) {
  const user = await getKey(`uid:${oId}`);
  if (user == null) {
    return {
      user: userName,
      uId: oId,
      gender: "1",
      nick_name: "",
      intimacy: 0,
      point: 0,
      auth: "",
      bag: "[]",
      last_liveness: 0,
    };
  }
  return user;
}

export async function updateUser(user: any) {
  return await setKey(`uid:${user.uId}`, user);
}

export async function getBankUser(oId: string) {
  const user = await getKey(`bank:uid:${oId}`);
  if (user == null) {
    return {
      uId: oId,
      point: 0,
    };
  }
  return user;
}

export async function updateBankUser(user: any) {
  return await setKey(`bank:uid:${user.uId}`, user);
}

export async function addUserIntimacy(oId: string, intimacy: number = 1, save: boolean = true) {
  const user = await getUser(oId);
  if (save) user.today_intimacy = (user.today_intimacy ?? 0) + 1;
  user.intimacy = parseInt(user.intimacy) ?? 0;
  if ((user.today_intimacy ?? 0) < 20 && intimacy == 1) {
    user.intimacy += 1;
  } else {
    user.intimacy += intimacy;
  }
  await setKey(`uid:${oId}`, user);
  return true;
}

export async function reduceUserIntimacy(oId: string, intimacy: number = 1) {
  const user = await getUser(oId);
  user.intimacy = (parseInt(user.intimacy) ?? 0) - intimacy;
  await setKey(`uid:${oId}`, user);
  return true;
}
