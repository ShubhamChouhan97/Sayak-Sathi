
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentDetails,downloadDocument } from "../Api/DocumentPageAPI";

interface Problem {
  text: string;
  tag: string;
}

interface DocumentData {
  name: string;
  mobileNumber: string;
  ward: string;
  problems: Problem[];
}

export const DocumentPreview: React.FC = () => {
  const { requestId, documentId } = useParams<{ requestId: string; documentId: string }>();
  const [docData, setDocData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!requestId || !documentId) {
          throw new Error("Missing requestId or documentId");
        }

        const response = await DocumentDetails(requestId, documentId);

        // Convert API data to match DocumentData type
        const transformed: DocumentData = {
          name: `${response.docname} (${response.nameInHindi})`,
          mobileNumber: response.phoneNumber,
          ward: `${response.wardNumber} (${response.wardNumber})`,
          problems: response.problems.map((item: any) => ({
            text: `${item.description.english} (${item.description.hindi})`,
            tag: item.category[0] || "General",
          })),
        };

        setDocData(transformed);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [requestId, documentId]);

  const handleDownload = async () => {
    if (!requestId) {
      console.error("Missing requestId");
      return;
    }
    try {
      await downloadDocument(requestId);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  if (!docData) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Document</h1>
          <p className="text-sm text-gray-500">
            Requests &gt; Documents &gt; <span className="font-medium">{docData.name.split(" ")[0]}'s</span> Document
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Download Original Document
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
        <table className="w-full text-sm text-gray-700">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium w-1/3">Name</td>
              <td className="py-2">{docData.name}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Mobile Number</td>
              <td className="py-2">{docData.mobileNumber}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Ward</td>
              <td className="py-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {docData.ward}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Problems Section */}
      <div className="bg-white rounded shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Problems</h2>
        <ul className="space-y-4">
          {docData.problems.map((problem, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded border border-gray-200">
              <p className="text-gray-800">{problem.text}</p>
              <span className="inline-block mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {problem.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
