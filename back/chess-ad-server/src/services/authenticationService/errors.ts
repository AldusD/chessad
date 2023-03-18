import { ApplicationError } from "@/protocols";

export function conflictError(conflictField: string): ApplicationError {
  return {
    name: "conflictError",
    message: `There is already an user to given ${conflictField}`,
  };
}

export function invalidCredentialsError(): ApplicationError {
  return {
    name: "InvalidCredentialsError",
    message: "email or password are incorrect"
  };
}

export function serverError(): ApplicationError {
  return {
    name: "ServerError",
    message: "Server error, please try again later"
  };
}

export function unauthorizedError(message: string): ApplicationError {
  return {
    name: "unauthorizedError",
    message: message || `invalid token`,
  };
}
