import ApiError from "./api.error";

export const handleApiError = (error: any) => {
    if (error.response) {
        return ApiError.fromResponse(error.response);
    } else {
        return ApiError.fromMessage(error.message);
    }
}