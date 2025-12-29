const asyncHandler = (func) => {
  return async (req, resp, next) => {
    try {
      await func(req, resp, next);
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return resp.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};
export default asyncHandler;
