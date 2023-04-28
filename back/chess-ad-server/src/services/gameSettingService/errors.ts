import { ApplicationError } from "@/protocols";

export function invalidPath(): ApplicationError {
  return {
    name: "invalidPath",
    message: "This path does no longer correspond to an active gameSetting"
  };
}
