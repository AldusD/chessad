import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export function loadEnv() {
  console.log('env', process.env.NODE_ENV)
  const path =
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "development"
        ? ".env.development"
        : ".env";
  
  const currentEnvs = dotenv.config({ path });
  console.log(currentEnvs)
  dotenvExpand.expand(currentEnvs);
}
