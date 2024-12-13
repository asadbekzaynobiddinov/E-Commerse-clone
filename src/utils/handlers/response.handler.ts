export const responseHandler = (res: any, result: any) => {
  if (!result.success) {
    return res.status(result.status).send(result.message);
  }
  return res.status(result.status).send(result.message);
};
