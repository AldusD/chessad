import { ApplicationError } from "@/protocols";

export enum Errors {
  invalidPathError,
  conflictError,
  invalidCredentialsError,
  serverError,
  unauthorizedError,
  cannotJoinGameError
}

export function invalidPathError(): ApplicationError {
  return {
    name: Errors.invalidPathError,
    message: "This path does no longer correspond to an active gameSetting"
  };
}

export function conflictError(conflictField: string): ApplicationError {
    return {
      name: Errors.conflictError,
      message: `There is already an user to given ${conflictField}`,
    };
  }
  
export function invalidCredentialsError(): ApplicationError {
  return {
    name: Errors.invalidCredentialsError,
    message: "Email or password are incorrect"
  };
}
  
export function serverError(): ApplicationError {
  return {
    name: Errors.serverError,
    message: "Server error, please try again later"
  };
}
  
export function unauthorizedError(message?: string): ApplicationError {
  return {
    name: Errors.unauthorizedError,
    message: message || `Invalid token`,
  };
}

export function cannotJoinGameError(message?: string): ApplicationError {
  return {
    name: Errors.cannotJoinGameError,
    message: message || 'User can not join this game',
  };
}
