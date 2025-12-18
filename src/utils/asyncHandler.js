const asyncHandler = (func) => {
  async (req, resp, next) => {
    try {
      await func(req, resp, next);
    } catch (error) {}
  };
};
export default { asyncHandler };
