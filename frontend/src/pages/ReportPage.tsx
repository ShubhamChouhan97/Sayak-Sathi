// import React, { useState,useEffect } from 'react';
// import { useParams, useNavigate,Link } from "react-router-dom";
// import { fetchRequestReport } from "../Api/ReportPage";
// const dummyCommonProblems = [
//   {
//     title: "Challenges in Agriculture (high input costs, low prices, weather impact, market issues)",
//     count: 3,
//     tags: ["Agriculture", "Social Issues", "Economic Issues"]
//   },
//   {
//     title: "Deficiencies in Education Infrastructure and Quality (lack of trained teachers, inadequate facilities)",
//     count: 2,
//     tags: ["Education", "Infrastructure"]
//   },
//   {
//     title: "Insufficient Healthcare Access (limited facilities, lack of staff/medicines, travel required)",
//     count: 2,
//     tags: ["Health", "Economic Issues"]
//   },
// ];

// const dummyWardWiseData = {
//   21: [
//     { issue: "Excessive water flow or wastage", count: 2, tags: ["Water Issues"] },
//     { issue: "Illegal liquor business", count: 1, tags: ["Illegal Activities", "Law and Order/Safety"] },
//     { issue: "Garbage accumulation due to lack of dustbins", count: 1, tags: ["Sanitation", "Waste Management"] },
//   ],
//   34: [
//     { issue: "Traffic congestion", count: 1, tags: ["Environment", "Infrastructure"] },
//     { issue: "Air pollution", count: 1, tags: ["Environment", "Health"] },
//     { issue: "Lack of proper waste management systems", count: 1, tags: ["Infrastructure"] },
//     { issue: "Overcrowding and shortage of affordable housing", count: 1, tags: ["Social Issues", "Economic Issues"] },
//   ],
// };

// export const ReportPage = () => {

//       const { requestId } = useParams<{ requestId: string }>();

//      useEffect(() => {
//          const fetchData = async () => {
//            if (requestId) {
//              const data = await fetchRequestReport(requestId);
//             //  setRequests(data);
//            }
//          };
//          fetchData();
//        }, [requestId]);
     



//   const [activeTab, setActiveTab] = useState('common');
//   const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});

//   const toggleWard = (wardNo: string) => {
//     setExpandedWards(prev => ({ ...prev, [wardNo]: !prev[wardNo] }));
//   };

//   const tabs = [
//     { key: 'common', label: 'Common Problems' },
//     { key: 'ward', label: 'Ward Wise Report' },
//     { key: 'analysis', label: 'Analysis' },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800"> Report</h2>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
//            Print
//         </button>
//       </div>

//       <div className="flex gap-4 mb-8">
//         {tabs.map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//               activeTab === tab.key
//                 ? 'bg-blue-600 text-white shadow'
//                 : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       <div>
//         {activeTab === 'common' && (
//           <div className="space-y-4">
//             {dummyCommonProblems.map((item, i) => (
//               <div key={i} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
//                 <div className="text-lg font-semibold text-gray-800">
//                   {item.title} <span className="text-sm text-blue-600">({item.count})</span>
//                 </div>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {item.tags.map((tag, j) => (
//                     <span
//                       key={j}
//                       className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === 'ward' && (
//           <div className="space-y-4">
//             {Object.entries(dummyWardWiseData).map(([wardNo, issues]) => (
//               <div key={wardNo} className="bg-white shadow rounded-lg border border-gray-200">
//                 <div
//                   onClick={() => toggleWard(wardNo)}
//                   className="cursor-pointer px-5 py-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
//                 >
//                   <h3 className="font-semibold text-gray-800 text-lg">Ward No: {wardNo}</h3>
//                   <span className="text-gray-600 text-sm">
//                     {expandedWards[wardNo] ? '▲ Collapse' : '▼ Expand'}
//                   </span>
//                 </div>
//                 {expandedWards[wardNo] && (
//                   <div className="p-5 space-y-4">
//                     {issues.map((issue, idx) => (
//                       <div key={idx}>
//                         <p className="font-medium text-gray-800">
//                           {issue.issue} <span className="text-blue-600">({issue.count})</span>
//                         </p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {issue.tags.map((tag, i) => (
//                             <span
//                               key={i}
//                               className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === 'analysis' && (
//           <div className="bg-white p-5 shadow rounded-lg border border-gray-200 text-center text-gray-600">
//             📈 Charts and graphical insights will appear here.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRequestReport } from "../Api/ReportPage";
import ProblemChart  from "../components/chart";
interface Reporter {
  docname: string;
  wardNumber?: string;
}

interface CommonProblem {
  problem: string;
  category: string;
  count: number;
  reporters: Reporter[];
}

interface WardProblem {
  ward: string;
  problems: {
    problem: string;
    category: string;
    count: number;
    reporters: Reporter[];
  }[];
}

interface Analytics {
  ward: string;
  totalProblems: number;
}

export const ReportPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [activeTab, setActiveTab] = useState("common");
  const [reportData, setReportData] = useState<{
    commonProblems: CommonProblem[];
    wardWiseProblems: WardProblem[];
    analytics: Analytics[];
  } | null>(null);

  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});

  const toggleWard = (wardNo: string) => {
    setExpandedWards((prev) => ({ ...prev, [wardNo]: !prev[wardNo] }));
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
          Print
        </button>
      </div>

      {/* Tabs */}
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

      {/* Tab content */}
      <div>
        {/* Common Problems */}
        {activeTab === "common" && (reportData?.commonProblems?.length ?? 0) > 0 && (
          <div className="space-y-5">
            {reportData?.commonProblems.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
              >
                <div className="text-xl font-semibold text-gray-800">
                  {item.problem}{" "}
                  <span className="text-sm text-blue-600">({item.count})</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
                {/* <div className="mt-3">
                  <strong>Reporters:</strong>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    {item.reporters.map((r, idx) => (
                      <li key={idx}>
                        {r.docname} {r.wardNumber && `(Ward ${r.wardNumber})`}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            ))}
          </div>
        )}

        {/* Ward Wise Report */}
        {activeTab === "ward" && (reportData?.wardWiseProblems?.length ?? 0) > 0 && (
          <div className="space-y-5">
            {reportData?.wardWiseProblems.map((ward) => (
              <div
                key={ward.ward}
                className="bg-white shadow rounded-lg border border-gray-200"
              >
                <div
                  onClick={() => toggleWard(ward.ward)}
                  className="cursor-pointer px-5 py-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Ward No: {ward.ward}
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {expandedWards[ward.ward] ? "▲ Collapse" : "▼ Expand"}
                  </span>
                </div>
                {expandedWards[ward.ward] && (
                  <div className="p-5 space-y-4">
                    {ward.problems.map((issue, idx) => (
                      <div key={idx}>
                        <p className="font-medium text-gray-800">
                          {issue.problem}{" "}
                          <span className="text-blue-600">({issue.count})</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                    {issue.category}
                  </span>
                </div>
                        {/* <div className="ml-4 mt-1">
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {issue.reporters.map((r, i) => (
                              <li key={i}>{r.docname}</li>
                            ))}
                          </ul>
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Analysis */}
        {/* {activeTab === "analysis" && (reportData?.analytics?.length ?? 0) > 0 && (
          <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Problem Count by Ward
            </h3>
            <ul className="space-y-2 text-gray-700">
              {reportData?.analytics.map((a, idx) => (
                <li key={idx}>
                  <strong>Ward {a.ward}:</strong> {a.totalProblems} problems
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {activeTab === "analysis" && <ProblemChart reportData={reportData} activeTab={activeTab} />}

      </div>
    </div>
  );
};
