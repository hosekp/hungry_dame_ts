interface ServerError {
  status: number;
  message: string;
  stack?: any;
}

export default ServerError;
