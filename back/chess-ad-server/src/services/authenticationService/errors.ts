import { ApplicationError } from "@/protocols";

export function conflictError(conflictField: string): ApplicationError {
  return {
    name: "conflictError",
    message: `There is already an user with given ${conflictField}`,
  };
}

export function invalidCredentialsError(): ApplicationError {
  return {
    name: "InvalidCredentialsError",
    message: "email or password are incorrect"
  };
}
