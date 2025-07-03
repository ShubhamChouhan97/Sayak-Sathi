// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { fetchRequestDetail } from "../Api/RequestPageAPI";
// import { ChevronDown } from "lucide-react"; // Optional: use any icon lib
// import { useNavigate } from "react-router-dom";

// interface Problem {
//   description: { english: string; hindi: string };
//   category: string[];
//   _id: string;
// }

// interface RequestData {
//   _id: string;
//   docname: string;
//   requestId: string;
//   requsetName: string;
//   wardNumber: string;
//   phoneNumber: string;
//   countryCode: string;
//   issues: string[];
//   problems: Problem[];
//   createdAt: string;
// }

// export const RequestDetail: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [requests, setRequests] = useState<RequestData[]>([]);
//   const [filteredWard, setFilteredWard] = useState("All");
//   const [filteredTag, setFilteredTag] = useState("All");

//   const [showWardDropdown, setShowWardDropdown] = useState(false);
//   const [showTagDropdown, setShowTagDropdown] = useState(false);

//   // Refs for dropdowns to handle clicks outside
//   const wardDropdownRef = useRef<HTMLDivElement>(null);
//   const tagDropdownRef = useRef<HTMLDivElement>(null);

//   // Refs for table headers to get their position
//   const wardHeaderRef = useRef<HTMLTableCellElement>(null);
//   const tagHeaderRef = useRef<HTMLTableCellElement>(null);

//   // States to store dropdown positions
//   const [wardDropdownPos, setWardDropdownPos] = useState({ top: 0, left: 0 });
//   const [tagDropdownPos, setTagDropdownPos] = useState({ top: 0, left: 0 });

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10); // Set items per page to 10

//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         const data = await fetchRequestDetail(id);
//         setRequests(data);
//       }
//     };
//     fetchData();
//   }, [id]);

//   // Effect to handle clicks outside of dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       // Close Ward dropdown if click is outside
//       if (
//         wardDropdownRef.current &&
//         !wardDropdownRef.current.contains(event.target as Node) &&
//         // Also ensure the click wasn't on the ward header button itself
//         wardHeaderRef.current &&
//         !wardHeaderRef.current.contains(event.target as Node)
//       ) {
//         setShowWardDropdown(false);
//       }
//       // Close Tag dropdown if click is outside
//       if (
//         tagDropdownRef.current &&
//         !tagDropdownRef.current.contains(event.target as Node) &&
//         // Also ensure the click wasn't on the tag header button itself
//         tagHeaderRef.current &&
//         !tagHeaderRef.current.contains(event.target as Node)
//       ) {
//         setShowTagDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Effect to calculate dropdown positions when they become visible or table layout changes
//   useEffect(() => {
//     const calculatePositions = () => {
//       if (showWardDropdown && wardHeaderRef.current) {
//         const rect = wardHeaderRef.current.getBoundingClientRect();
//         // Position fixed dropdown relative to viewport
//         setWardDropdownPos({ top: rect.bottom, left: rect.left });
//       }
//       if (showTagDropdown && tagHeaderRef.current) {
//         const rect = tagHeaderRef.current.getBoundingClientRect();
//         // Position fixed dropdown relative to viewport
//         setTagDropdownPos({ top: rect.bottom, left: rect.left });
//       }
//     };

//     // Recalculate on mount/update and on window resize/scroll
//     calculatePositions();
//     window.addEventListener('resize', calculatePositions);
//     window.addEventListener('scroll', calculatePositions); // Important for tables inside scrollable containers

//     return () => {
//       window.removeEventListener('resize', calculatePositions);
//       window.removeEventListener('scroll', calculatePositions);
//     };
//   }, [showWardDropdown, showTagDropdown, requests]); // Re-calculate if table data or visibility changes

//   const getAllUnique = (key: "wardNumber" | "issues") => {
//     const values = new Set<string>();
//     requests.forEach((req) => {
//       if (key === "wardNumber") {
//         values.add(req.wardNumber);
//       } else {
//         req.issues.forEach((issue) => values.add(issue));
//       }
//     });
//     return Array.from(values);
//   };

//   const filteredData = requests.filter((req) => {
//     const wardMatch = filteredWard === "All" || req.wardNumber === filteredWard;
//     const tagMatch = filteredTag === "All" || req.issues.includes(filteredTag);
//     return wardMatch && tagMatch;
//   });

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const renderPaginationButtons = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => paginate(i)}
//           className={`px-3 py-1 border rounded ${
//             currentPage === i ? "bg-blue-600 text-white" : "hover:bg-gray-100"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }
//     return pageNumbers;
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-6">
//         <span className="text-gray-500"> Request </span> /{" "}
//         {requests[0]?.requsetName || " "}
//         <span> Documents</span>
//       </h2>

//       {/* The table structure remains mostly the same, but dropdowns are moved */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg shadow-md">
//           <thead className="bg-gray-100 text-gray-700 text-sm">
//             <tr>
//               <th className="p-3 text-left">Sr.No</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Mobile Number</th>
//               <th ref={wardHeaderRef} className="relative p-3 text-left">
//                 Ward
//                 <button
//                   className="ml-2 inline-flex items-center justify-center text-gray-600 hover:text-black"
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent immediate closing from document listener
//                     setShowWardDropdown((prev) => !prev);
//                     setShowTagDropdown(false); // Close other dropdown
//                   }}
//                 >
//                   <ChevronDown size={16} />
//                 </button>
//                 {/* Dropdown content is NOT rendered here anymore */}
//               </th>
//               <th className="p-3 text-left">Problems</th>
//               <th ref={tagHeaderRef} className="relative p-3 text-left">
//                 Tags
//                 <button
//                   className="ml-2 inline-flex items-center justify-center text-gray-600 hover:text-black"
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent immediate closing from document listener
//                     setShowTagDropdown((prev) => !prev);
//                     setShowWardDropdown(false); // Close other dropdown
//                   }}
//                 >
//                   <ChevronDown size={16} />
//                 </button>
//                 {/* Dropdown content is NOT rendered here anymore */}
//               </th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm">
//             {currentItems.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center p-4 text-gray-500">
//                   No matching records found.
//                 </td>
//               </tr>
//             ) : (
//               currentItems.map((req, index) => (
//                 <tr key={req._id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{indexOfFirstItem + index + 1}</td>
//                   <td className="p-3">{req.docname}</td>
//                   <td className="p-3">
//                     {req.countryCode} {req.phoneNumber}
//                   </td>
//                   <td className="p-3">{req.wardNumber}</td>
//                   <td className="p-3">{req.problems.length}</td>
//                   <td className="p-3 flex flex-wrap gap-2">
//                     {req.issues.slice(0, 2).map((issue, i) => (
//                       <span
//                         key={i}
//                         className="bg-gray-200 px-2 py-1 rounded text-xs"
//                       >
//                         {issue}
//                       </span>
//                     ))}
//                     {req.issues.length > 2 && (
//                       <span className="text-gray-500 text-sm">...</span>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/dashboard/requestDetails/${req.requestId}/document/${req._id}`
//                         )
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//                     >
//                       {" "}
//                       View Document
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* Pagination Controls */}
//         {filteredData.length > itemsPerPage && (
//           <div className="mt-4 flex justify-end space-x-2 text-sm">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {renderPaginationButtons()}
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Render Ward Dropdown outside the overflow-x-auto div */}
//       {showWardDropdown && (
//         <div
//           ref={wardDropdownRef}
//           // Use 'fixed' position to make it independent of parent overflow
//           // Use z-[1000] for a very high z-index, ensuring it's on top
//           className="fixed bg-white border border-gray-200 rounded shadow-lg w-40 z-[1000] max-h-60 overflow-y-auto"
//           style={{ top: wardDropdownPos.top + 5, left: wardDropdownPos.left }} // Added 5px to top for spacing
//           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dropdown
//         >
//           <ul className="py-1">
//             <li
//               className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
//               onClick={() => {
//                 setFilteredWard("All");
//                 setShowWardDropdown(false);
//                 setCurrentPage(1); // Reset to first page on filter change
//               }}
//             >
//               All
//             </li>
//             {getAllUnique("wardNumber").map((ward) => (
//               <li
//                 key={ward}
//                 className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
//                 onClick={() => {
//                   setFilteredWard(ward);
//                   setShowWardDropdown(false);
//                   setCurrentPage(1); // Reset to first page on filter change
//                 }}
//               >
//                 {ward}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Render Tag Dropdown outside the overflow-x-auto div */}
//       {showTagDropdown && (
//         <div
//           ref={tagDropdownRef}
//           className="fixed bg-white border border-gray-200 rounded shadow-lg w-40 z-[1000] max-h-60 overflow-y-auto"
//           style={{ top: tagDropdownPos.top + 5, left: tagDropdownPos.left }} // Added 5px to top for spacing
//           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dropdown
//         >
//           <ul className="py-1">
//             <li
//               className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
//               onClick={() => {
//                 setFilteredTag("All");
//                 setShowTagDropdown(false);
//                 setCurrentPage(1); // Reset to first page on filter change
//               }}
//             >
//               All
//             </li>
//             {getAllUnique("issues").map((tag) => (
//               <li
//                 key={tag}
//                 className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
//                 onClick={() => {
//                   setFilteredTag(tag);
//                   setShowTagDropdown(false);
//                   setCurrentPage(1); // Reset to first page on filter change
//                 }}
//               >
//                 {tag}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import { fetchRequestDetail } from "../Api/RequestPageAPI";
import { ChevronDown } from "lucide-react";

interface Problem {
  description: { english: string; hindi: string };
  category: string[];
  _id: string;
}

interface RequestData {
  _id: string;
  docname: string;
  requestId: string;
  requsetName: string;
  wardNumber: string;
  phoneNumber: string;
  countryCode: string;
  issues: string[];
  problems: Problem[];
  createdAt: string;
}

export const RequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [requests, setRequests] = useState<RequestData[]>([]);

  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const wardDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const wardHeaderRef = useRef<HTMLTableCellElement>(null);
  const tagHeaderRef = useRef<HTMLTableCellElement>(null);

  const [wardDropdownPos, setWardDropdownPos] = useState({ top: 0, left: 0 });
  const [tagDropdownPos, setTagDropdownPos] = useState({ top: 0, left: 0 });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchRequestDetail(id);
        setRequests(data);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(event.target as Node) &&
        wardHeaderRef.current &&
        !wardHeaderRef.current.contains(event.target as Node)
      ) {
        setShowWardDropdown(false);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node) &&
        tagHeaderRef.current &&
        !tagHeaderRef.current.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const calculatePositions = () => {
      if (showWardDropdown && wardHeaderRef.current) {
        const rect = wardHeaderRef.current.getBoundingClientRect();
        setWardDropdownPos({ top: rect.bottom + 5, left: rect.left });
      }
      if (showTagDropdown && tagHeaderRef.current) {
        const rect = tagHeaderRef.current.getBoundingClientRect();
        setTagDropdownPos({ top: rect.bottom + 5, left: rect.left });
      }
    };
    calculatePositions();
    window.addEventListener("resize", calculatePositions);
    window.addEventListener("scroll", calculatePositions);
    return () => {
      window.removeEventListener("resize", calculatePositions);
      window.removeEventListener("scroll", calculatePositions);
    };
  }, [showWardDropdown, showTagDropdown, requests]);

  const getAllUnique = (key: "wardNumber" | "issues") => {
    const values = new Set<string>();
    requests.forEach((req) => {
      if (key === "wardNumber") {
        values.add(req.wardNumber);
      } else {
        req.issues.forEach((issue) => values.add(issue));
      }
    });
    return Array.from(values);
  };

  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const filteredData = requests.filter((req) => {
    const wardMatch =
      selectedWards.length === 0 || selectedWards.includes(req.wardNumber);
    const tagMatch =
      selectedTags.length === 0 ||
      req.issues.some((issue) => selectedTags.includes(issue));
    return wardMatch && tagMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="p-6">
 <h2 className="text-2xl font-semibold mb-6">
      <span
        onClick={() => navigate("/dashboard/requests")}
        className="text-gray-500 hover:underline hover:text-gray-700 cursor-pointer transition-colors duration-200"
      >
        Request
      </span>{" "}
      / {requests[0]?.requsetName || " "}
      <span> Documents</span>
    </h2>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile Number</th>
              <th ref={wardHeaderRef} className="relative p-3 text-left">
                Ward
                <button
                  className="ml-2 inline-flex items-center text-gray-600 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWardDropdown((prev) => !prev);
                    setShowTagDropdown(false);
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="p-3 text-left">Problems</th>
              <th ref={tagHeaderRef} className="relative p-3 text-left">
                Tags
                <button
                  className="ml-2 inline-flex items-center text-gray-600 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTagDropdown((prev) => !prev);
                    setShowWardDropdown(false);
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              currentItems.map((req, index) => (
                <tr key={req._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{indexOfFirstItem + index + 1}</td>
                  <td className="p-3">{req.docname}</td>
                  <td className="p-3">
                    {req.countryCode} {req.phoneNumber}
                  </td>
                  <td className="p-3">{req.wardNumber}</td>
                  <td className="p-3">{req.problems.length}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {req.issues.slice(0, 2).map((issue, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded text-xs"
                      >
                        {issue}
                      </span>
                    ))}
                    {req.issues.length > 2 && (
                      <span className="text-gray-500 text-sm">...</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/requestDetails/${req.requestId}/document/${req._id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View Document
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="mt-4 flex justify-end space-x-2 text-sm">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Ward Dropdown */}
      {showWardDropdown && (
        <div
          ref={wardDropdownRef}
          className="fixed bg-white border border-gray-200 rounded shadow-lg w-48 z-[1000] max-h-72 overflow-y-auto"
          style={wardDropdownPos}
        >
          <div className="px-4 py-2 text-sm font-medium border-b">Filter Ward</div>
          <div className="px-4 py-2 space-y-1">
            {getAllUnique("wardNumber").map((ward) => (
              <label key={ward} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedWards.includes(ward)}
                  onChange={() =>
                    handleCheckboxChange(ward, selectedWards, setSelectedWards)
                  }
                />
                {ward}
              </label>
            ))}
          </div>
          <div className="flex justify-between p-2 border-t text-sm">
            <button
              onClick={() => {
                setSelectedWards([]);
                setCurrentPage(1);
              }}
              className="text-red-500 hover:underline"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setShowWardDropdown(false);
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:underline"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Tag Dropdown */}
      {showTagDropdown && (
        <div
          ref={tagDropdownRef}
          className="fixed bg-white border border-gray-200 rounded shadow-lg w-48 z-[1000] max-h-72 overflow-y-auto"
          style={tagDropdownPos}
        >
          <div className="px-4 py-2 text-sm font-medium border-b">Filter Tags</div>
          <div className="px-4 py-2 space-y-1">
            {getAllUnique("issues").map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() =>
                    handleCheckboxChange(tag, selectedTags, setSelectedTags)
                  }
                />
                {tag}
              </label>
            ))}
          </div>
          <div className="flex justify-between p-2 border-t text-sm">
            <button
              onClick={() => {
                setSelectedTags([]);
                setCurrentPage(1);
              }}
              className="text-red-500 hover:underline"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setShowTagDropdown(false);
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:underline"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
