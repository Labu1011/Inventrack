export function successResponse(data, message = null) {
  const response = {
    status: "success",
  }

  if (message) {
    response.message = message
  }

  response.data = data
  return response
}
