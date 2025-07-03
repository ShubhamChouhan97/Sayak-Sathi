import { mainClient } from "../store"; // adjust path if needed


export const fetchRequestReport = async (requestId: string) => {
    try {
        const response = await mainClient.request("POST", "/api/request/RequestReport", {
        data: { requestId },
        });
       return response.data;
      } catch (error) {
        console.error("Error downloading template:", error);
        throw error;
      }
};