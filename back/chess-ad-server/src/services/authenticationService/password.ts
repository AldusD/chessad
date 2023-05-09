import bcrypt from "bcrypt";
import { invalidCredentialsError } from "../errors";

async function encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

async function validatePassword(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw invalidCredentialsError();
  }

export { encryptPassword, validatePassword };