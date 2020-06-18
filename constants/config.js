
export default {
    HOST: "127.0.0.1",
    PORT: Number(Deno.env.get('PORT')),
    JWT_SECRET: Deno.env.get('JWT_SECRET'),
    JWT_OPTS_EXPIRE_IN: 2592000000,
    JWT_OPTS_ISSUER: Deno.env.get('JWT_OPTS_ISSUER'),
    DEV_MONGODB_URL: "mongodbUrl"
}
