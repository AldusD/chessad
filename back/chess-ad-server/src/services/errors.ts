import { ApplicationError } from "@/protocols";

export enum Errors {
  invalidPathError,
  conflictError,
  invalidCredentialsError,
  serverError,
  unauthorizedError,
  cannotJoinGameError,
  unprocessableEntityError,
  InvalidDataError
}

export function invalidPathError(): ApplicationError {
  return {
    name: Errors.invalidPathError,
    message: "This path does not correspond to an active game or gameSetting"
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

export function unprocessableEntityError(message?: string): ApplicationError {
    return {
      name: Errors.unprocessableEntityError,
      message: message || 'invalid data',
    };
  }
