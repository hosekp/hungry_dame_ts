import ServerError from "./server-error";

class ArgumentError extends Error implements ServerError {
  status: number;
  message: string;
  constructor(message: string) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}
export default ArgumentError;
