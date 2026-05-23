const success = (res, data = {}, message, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data, ...(message ? { message } : {}) });

const paginated = (res, data, pagination) =>
  res.status(200).json({ success: true, data, pagination });

const error = (res, err) =>
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Unexpected server error',
      details: err.details || []
    }
  });

module.exports = { success, paginated, error };
