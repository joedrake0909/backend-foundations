import { z } from "zod";

import { bodyObject } from "./common.js";

export const updateRoleSchema = bodyObject({
    role: z.enum(["user", "admin"], "Role must be 'user' or 'admin'")
});
