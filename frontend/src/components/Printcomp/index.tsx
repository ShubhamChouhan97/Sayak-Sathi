import React from 'react';
import ProblemChart from '../chart'; // Assuming 'chart.tsx' is in the 'components' folder

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
  id: string;
  _id: string;
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

// Helper to render problem details consistently for print (no view document button needed for print)
const RenderReporterDetails = ({ reporters, problemTitle }: { reporters: Reporter[]; problemTitle: string }) => (
  <div className="text-gray-700 space-y-4 pt-4 border-t border-gray-200 mt-4">
    <h4 className="font-bold text-md mb-2">Reporters for {problemTitle}:</h4>
    {reporters.map((reporter) => (
      <div key={reporter._id || reporter.id} className="border p-3 rounded-md shadow-sm bg-gray-50">
        <h5 className="font-bold text-base mb-1">{reporter.docname}</h5>
        <p className="text-sm mb-1">
          <span className="font-medium">Phone:</span> {reporter.phoneNumber}
        </p>
        {reporter.wardNumber && (
          <p className="text-sm mb-2">
            <span className="font-medium">Ward:</span> {reporter.wardNumber}
          </p>
        )}

        <p className="font-semibold text-sm mb-2">Reported Problems by {reporter.docname}:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          {reporter.commonproblems.length > 0 ? (
            reporter.commonproblems.map((problemDetail) => (
              <li key={problemDetail._id} className="mb-1">
                <p className="text-xs font-medium">{problemDetail.description.english}</p>
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
            <p className="text-xs text-gray-500">No specific problems detailed by this reporter.</p>
          )}
        </ul>
      </div>
    ))}
  </div>
);

// This component will be passed to react-to-print
const PrintableReportContent = React.forwardRef<HTMLDivElement, { reportData: ReportData | null }>(
  ({ reportData }, ref) => {
    if (!reportData) {
      return <div className="text-center text-gray-600 p-8">Loading report data...</div>;
    }

    return (
      <div ref={ref} className="print-area p-8 bg-white text-gray-800">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 border-b-2 pb-4">Comprehensive Problem Report</h1>

        {/* Common Problems Section */}
        {reportData.commonProblems && reportData.commonProblems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Common Problems</h2>
            <div className="space-y-6">
              {reportData.commonProblems.map((item, i) => (
                <div key={item._id || i} className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                  <div className="text-xl font-semibold text-gray-800 mb-2">
                    {item.problem} <span className="text-base text-blue-600">({item.count} reports)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.category.map((cat, catIdx) => (
                      <span key={catIdx} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <RenderReporterDetails reporters={item.reporters} problemTitle={item.problem} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ward Wise Report Section */}
        {reportData.wardWiseProblems && reportData.wardWiseProblems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">2. Ward Wise Report</h2>
            <div className="space-y-6">
              {reportData.wardWiseProblems.map((ward) => (
                <div key={ward._id || ward.ward} className="bg-white shadow rounded-lg border border-gray-200">
                  <div className="px-5 py-4 bg-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Ward No: {ward.ward}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {ward.problems.map((issue, idx) => (
                      <div key={issue._id || idx} className="pb-4 border-b border-gray-100 last:border-b-0">
                        <p className="font-medium text-gray-800 mb-2">
                          {issue.problem}{" "}
                          <span className="text-blue-600">({issue.count} reports)</span>
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {issue.category.map((cat, catIdx) => (
                            <span key={catIdx} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <RenderReporterDetails reporters={issue.reporters} problemTitle={`Ward ${ward.ward} - ${issue.problem}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Section (Chart) */}
        {/* {reportData.analytics && reportData.analytics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">3. Analysis by Category</h2>
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">

              <ProblemChart reportData={reportData} activeTab="analysis" />
            </div>
          </div>
        )} */}

        {/* Add a footer for print */}
        <div className="text-center text-gray-500 text-sm mt-12 pt-4 border-t border-gray-300">
          Report generated on {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} (Panchkula, Haryana)
        </div>
      </div>
    );
  }
);

export default PrintableReportContent;