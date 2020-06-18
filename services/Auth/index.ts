import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import config from "../../constants/config.js";

const key: string = config.JWT_SECRET || "";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

const createToken = (user: any) => {
  if (!user && !user.id) {
    return null;
  }
  const payload: Payload = {
    id: user.id,
    iss: config.JWT_OPTS_ISSUER,
    exp: setExpiration(
      new Date().getTime() + Number(config.JWT_OPTS_EXPIRE_IN),
    ),
  };

  return makeJwt({ header, payload, key });
};

const verifyToken = (jwt: string) => {
  return validateJwt(jwt, key);
};

const getTokenFromHeaders = (ctx: any) => {
  const authorization = ctx.request.headers.get("Authorization");
  const token = authorization.replace("Bearer ", "");

  if (token) {
    try {
      return verifyToken(token);
    } catch (error) {
      return null;
    }
  }

  return null;
};

export default {
  createToken,
  verifyToken,
  getTokenFromHeaders,
};
