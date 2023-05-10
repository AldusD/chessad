import { ApplicationError } from "@/protocols";
import { Errors } from "../services/errors";

export function invalidDataError(details: string[]): ApplicationInvalidateDataError {
  return {
    name: Errors.InvalidDataError,
    message: "Invalid data",
    details,
  };
}

type ApplicationInvalidateDataError = ApplicationError & {
  details: string[];
};
