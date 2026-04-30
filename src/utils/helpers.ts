export const catchAsync = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const generateBookingReference = (): string => {
  const randomAlphaNumeric = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `BK-${randomAlphaNumeric}`;
};
