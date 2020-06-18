import { Router } from "https://deno.land/x/oak/mod.ts";

import * as controllers from "./user.controllers.ts";

const router = new Router({
  prefix: "/users",
});

router.get("/:id", controllers.getUserById);

export default router;
