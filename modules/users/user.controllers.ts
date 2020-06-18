export const getUserById = async (ctx: any) => {
  try {
    if (!ctx.params.id) {
      ctx.status = 404;
      ctx.response.body = { error: "not_found" };
      return;
    }
    ctx.response.body = [ctx.params.id];
  } catch (error) {
    ctx.status = 500;
    ctx.response.body = { error };
  }
};
