import { authJwt } from "../modules/auth/auth.controllers.ts";

import auth from "../modules/auth/auth.routes.ts";
import users from "../modules/users/user.routes.ts";

export default (app: any) => {
  // app.use(express.static('public'))
  // app.use('/api/v1/auth', authRoutes)
  // app.use('/api/v1/user', authJwt, userRoutes)

  app.use(auth.routes());
  app.use(auth.allowedMethods());

  app.use(authJwt, users.routes());
  app.use(users.allowedMethods());
};
