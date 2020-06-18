import AuthService from "../../services/Auth/index.ts";

export const authJwt = async (ctx: any, next: any) => {
  try {
    const token: any = AuthService.getTokenFromHeaders(ctx);
    if (!token || !token.id) throw new Error();

    const user = {}; // get user from database

    ctx.response.user = user;
    await next();
  } catch (error) {
    ctx.response.user = null;
    ctx.status = 401;
    ctx.response.body = JSON.stringify({ error: "Not authorized" });
  }
};

export const check = async (ctx: any) => {
  try {
    const jwtToken = AuthService.createToken(ctx.response.user);
    ctx.status = 200;
    ctx.response.body = JSON.stringify(
      { data: { token: jwtToken, user: ctx.response.user } },
    );
  } catch (error) {
    ctx.status = 401;
    ctx.response.body = JSON.stringify({ error });
  }
};
