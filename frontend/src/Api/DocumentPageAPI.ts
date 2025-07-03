
import { mainClient } from "../store"; // adjust path if needed

export const DocumentDetails = async (requestId:string,documentId:string)=>{

  try {
        const response = await mainClient.request("POST", "/api/request/DocumentDetails", {
        data: { requestId, documentId },
        });
       return response.data;
      } catch (error) {
        console.error("Error downloading template:", error);
        throw error;
      }

}

export const downloadDocument = async (requestId: string) => {
  try {
    const response = await mainClient.request("POST", "/api/request/downloadDocument", {
      responseType: "blob",
      data: { requestId },
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      // Use the filename from response headers, or a default
      const disposition = response.headers["content-disposition"];
      const filenameMatch = disposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : "document.pdf";

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    console.error("Error downloading document:", error);
    throw error;
  }
};
