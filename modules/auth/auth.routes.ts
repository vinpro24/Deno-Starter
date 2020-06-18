import { Router } from "https://deno.land/x/oak/mod.ts";

import * as controllers from "./auth.controllers.ts";

const router = new Router({
  prefix: "/auth",
});

router.get("/", controllers.check);

export default router;
