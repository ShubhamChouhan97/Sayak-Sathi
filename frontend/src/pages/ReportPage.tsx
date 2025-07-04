import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRequestReport } from "../Api/ReportPage";
import ProblemChart from "../components/chart"; // Keep this for the on-screen view
import PrintableReportContent from "../components/Printcomp"; // Import the new component
import { Modal } from "antd";
import { useReactToPrint } from 'react-to-print'; // Import the hook

// Re-using your existing interfaces
interface CommonPro {
  category: string[];
  description: {
    english: string;
    hindi: string;
  };
  _id: string;
}

interface Reporter {
  docname: string;
  phoneNumber: string;
  wardNumber?: string;
  id: string; // The ID you want to use for the document path
  _id: string; // MongoDB's _id
  commonproblems: CommonPro[];
}

interface CommonProblem {
  problem: string;
  category: string[];
  count: number;
  reporters: Reporter[];
  _id: string;
}

interface WardProblem {
  ward: number;
  problems: {
    problem: string;
    category: string[];
    count: number;
    reporters: Reporter[];
    _id: string;
  }[];
  _id: string;
}

interface Analytics {
  ward: number;
  totalProblems: number;
  categories: Array<{ category: string; count: number; _id: string; }>;
  _id: string;
}

interface ReportData {
  commonProblems: CommonProblem[];
  wardWiseProblems: WardProblem[];
  analytics: Analytics[];
}


export const ReportPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("common");
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalProblemDetails, setModalProblemDetails] = useState<{
    problem: string;
    reporters: Reporter[];
  } | null>(null);

  // Ref for the printable component
  const componentRef = useRef<HTMLDivElement>(null);

  // Hook from react-to-print
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Report for Request ID: ${requestId}`,
    pageStyle: `@page { size: A4; margin: 15mm; } @media print { body { -webkit-print-color-adjust: exact; color-adjust: exact; } }`,
    // You can also add more styles here if needed.
    // For example, to ensure your Tailwind classes are applied:
    // This is a common challenge with print. You might need to build your print CSS
    // to specifically target elements within the print area.
    // Consider using a dedicated print.css file and importing it here if your
    // Tailwind setup isn't generating the necessary utility classes for print.
    // Example: styles: `@import url('your-tailwind-build.css');`
    // Or, more simply, ensure all necessary Tailwind classes are present on elements
    // within PrintableReportContent and are not purged for print media queries.
  });


  const toggleWard = (wardNo: string) => {
    setExpandedWards((prev) => ({ ...prev, [wardNo]: !prev[wardNo] }));
  };

  const showModal = (reporters: Reporter[], problemTitle: string) => {
    setModalProblemDetails({ problem: problemTitle, reporters: reporters });
    setIsModalVisible(true);
  };

  const handleViewDocumentClick = (reporterDocId: string) => {
    if (requestId) {
      navigate(`/dashboard/requestDetails/${requestId}/document/${reporterDocId}`);
    } else {
      console.warn("Request ID not found for navigation.");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (requestId) {
        const data = await fetchRequestReport(requestId);
        setReportData(data);
      }
    };
    fetchData();
  }, [requestId]);

  const tabs = [
    { key: "common", label: "Common Problems" },
    { key: "ward", label: "Ward Wise Report" },
    { key: "analysis", label: "Analysis" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Report</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={handlePrint} // Call the handlePrint from useReactToPrint
        >
          Print All
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Common Problems */}
      {activeTab === "common" && (reportData?.commonProblems?.length ?? 0) > 0 && (
        <div className="space-y-5">
          {reportData?.commonProblems.map((item, i) => (
            <div
              key={item._id || i}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
            >
              <div className="text-xl font-semibold text-gray-800">
                {item.problem}{" "}
                <span
                  className="text-sm text-blue-600 cursor-pointer"
                  onClick={() => showModal(item.reporters, item.problem)}
                >
                  ({item.count})
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.category.map((cat, catIdx) => (
                  <span
                    key={catIdx}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium cursor-pointer"
                    onClick={() => showModal(item.reporters, item.problem)}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ward Wise Report */}
      {activeTab === "ward" && !!reportData && (reportData.wardWiseProblems?.length ?? 0) > 0 && (
        <div className="space-y-5">
          {reportData.wardWiseProblems.map((ward) => (
            <div
              key={ward._id || ward.ward}
              className="bg-white shadow rounded-lg border border-gray-200"
            >
              <div
                onClick={() => toggleWard(String(ward.ward))}
                className="cursor-pointer px-5 py-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
              >
                <h3 className="font-semibold text-gray-800 text-lg">
                  Ward No: {ward.ward}
                </h3>
                <span className="text-gray-600 text-sm">
                  {expandedWards[String(ward.ward)] ? "▲ Collapse" : "▼ Expand"}
                </span>
              </div>
              {expandedWards[String(ward.ward)] && (
                <div className="p-5 space-y-4">
                  {ward.problems.map((issue, idx) => (
                    <div key={issue._id || idx}>
                      <p className="font-medium text-gray-800">
                        {issue.problem}{" "}
                        <span
                          className="text-blue-600 cursor-pointer"
                          onClick={() =>
                            showModal(issue.reporters, `Ward ${ward.ward} - ${issue.problem}`)
                          }
                        >
                          ({issue.count})
                        </span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {issue.category.map((cat, catIdx) => (
                          <span
                            key={catIdx}
                            className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium cursor-pointer"
                            onClick={() =>
                              showModal(issue.reporters, `Ward ${ward.ward} - ${issue.problem}`)
                            }
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {activeTab === "analysis" && (
        <ProblemChart reportData={reportData ?? {}} activeTab={activeTab} />
      )}

      {/* Modal for reporter details (unchanged) */}
      <Modal
        title={`Reporters for: ${modalProblemDetails?.problem}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="text-gray-700 space-y-4 max-h-96 overflow-y-auto pr-2">
          {modalProblemDetails?.reporters.map((reporter) => (
            <div key={reporter._id || reporter.id} className="border p-4 rounded-md shadow-sm bg-gray-50">
              <h4 className="font-bold text-lg mb-2">{reporter.docname}</h4>
              <p className="text-sm mb-1">
                <span className="font-medium">Phone:</span> {reporter.phoneNumber}
              </p>
              {reporter.wardNumber && (
                <p className="text-sm mb-2">
                  <span className="font-medium">Ward:</span> {reporter.wardNumber}
                </p>
              )}

              <p className="font-semibold text-base mb-2">Reported Problems:</p>
              <ul className="list-disc list-inside space-y-2">
                {reporter.commonproblems.length > 0 ? (
                  reporter.commonproblems.map((problemDetail) => (
                    <li key={problemDetail._id} className="mb-2">
                      <p className="text-sm font-medium">{problemDetail.description.english}</p>
                      {problemDetail.description.hindi && (
                        <p className="text-xs text-gray-600 italic">{problemDetail.description.hindi}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {problemDetail.category.map((cat, catIdx) => (
                          <span key={catIdx} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specific problems detailed for this reporter.</p>
                )}
              </ul>

              <div className="mt-4 text-right">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  onClick={() => handleViewDocumentClick(reporter.id)}
                >
                  View Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* The component to print, rendered off-screen */}
      <div style={{ display: 'none' }}>
        <PrintableReportContent ref={componentRef} reportData={reportData} />
      </div>
    </div>
  );
};