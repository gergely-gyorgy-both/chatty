import { copyFileSync } from "fs";

const source = "dist/environment.prod.js";
const target = "dist/environment.js";

copyFileSync(source, target);

