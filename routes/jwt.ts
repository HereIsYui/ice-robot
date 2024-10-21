import { getKey } from "@lib/redis";

export const jwt = async (req: any, res: any, next: any) => {
  const client_id = req.headers["client_id"]?.toString();
  const client_secret = req.headers["client_secret"]?.toString();
  if (!client_id || !client_secret) {
    return res.status(401).send({ message: "Permission verification failed" });
  }
  const result = await getKey("CLIENT:" + client_id);
  if (result != client_secret) {
    return res.status(401).send({ message: "Permission verification failed" });
  } else {
    next();
  }
};
