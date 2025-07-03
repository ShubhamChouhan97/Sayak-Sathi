import { mainClient } from "../store"; 

export const fetchRequestDetail = async (id: string) => {
      try {
        const response = await mainClient.request("POST", "/api/request/RequestDocumentDetails", {
        data: { id },
        });
       return response.data;
      } catch (error) {
        console.error("Error downloading template:", error);
        throw error;
      }
}