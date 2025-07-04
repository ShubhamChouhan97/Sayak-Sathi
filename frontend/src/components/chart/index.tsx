// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import Slider from "@mui/material/Slider";

// interface ProblemChartProps {
//   reportData: {
//     analytics?: { ward: number; totalProblems: number; categories: Array<any> }[];
//   };
//   activeTab: string;
// }

// const ProblemChart = ({ reportData, activeTab }: ProblemChartProps) => {
//   const analytics = reportData?.analytics || [];

//   // Find ward number range
//   const wardNumbers = analytics.map((a) => a.ward);
//   const minWard = Math.min(...wardNumbers);
//   const maxWard = Math.max(...wardNumbers);

//   // State to control the slider range
//   const [wardRange, setWardRange] = useState([minWard, maxWard]);

//   // Filter data based on slider
//   const filteredData = analytics.filter(
//     (a) => a.ward >= wardRange[0] && a.ward <= wardRange[1]
//   );

//   if (activeTab !== "analysis" || analytics.length === 0) return null;

//   return (
//     <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
//       <h3 className="text-xl font-semibold text-gray-800 mb-4">
//         Problem Count by Ward
//       </h3>

//       <div className="mb-4">
//         <Slider
//           value={wardRange}
//           onChange={(_, newValue) => setWardRange(newValue)}
//           valueLabelDisplay="auto"
//           min={minWard}
//           max={maxWard}
//         />
//         <p className="text-sm text-gray-600">
//           Showing wards {wardRange[0]} to {wardRange[1]}
//         </p>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="ward" label={{ value: "Ward", position: "insideBottom", dy: 10 }} />
//           <YAxis label={{ value: "Problems", angle: -90, position: "insideLeft" }} />
//           <Tooltip />
//           <Bar dataKey="totalProblems" fill="#4f46e5" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ProblemChart;


import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Slider from "@mui/material/Slider";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

interface ProblemChartProps {
  reportData: {
    analytics?: { ward: number; totalProblems: number; categories: Array<any> }[];
  };
  activeTab: string;
}

const ProblemChart = ({ reportData, activeTab }: ProblemChartProps) => {
  const analytics = reportData?.analytics || [];

  const wardNumbers = analytics.map((a) => +a.ward);
  const minWard = Math.min(...wardNumbers);
  const maxWard = Math.max(...wardNumbers);

  const [wardRange, setWardRange] = useState([minWard, maxWard]);
  const [selectedCategories, setSelectedCategories] = useState<any[] | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const filteredData = analytics.filter(
    (a) => +a.ward >= wardRange[0] && +a.ward <= wardRange[1]
  );

  if (activeTab !== "analysis" || analytics.length === 0) return null;

  const handleBarClick = (data: any) => {
    setSelectedCategories(data.categories);
    setSelectedWard(data.ward);
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Problem Count by Ward
      </h3>

      <div className="mb-4">
        <Slider
          value={wardRange}
          onChange={(_, newValue) => setWardRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={minWard}
          max={maxWard}
        />
        <p className="text-sm text-gray-600">
          Showing wards {wardRange[0]} to {wardRange[1]}
        </p>
      </div>

      {/* Flexbox for Side-by-side Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bar Chart (Left) */}
        <div className="w-full lg:w-2/3 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="ward"
                label={{ value: "Ward", position: "insideBottom", dy: 10 }}
              />
              <YAxis
                label={{ value: "Problems", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Bar
                dataKey="totalProblems"
                fill="#4f46e5"
                onClick={(_, index) => {
                  const data = filteredData[index];
                  if (data) {
                    handleBarClick(data);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart (Right) */}
        {selectedCategories && (
          <div className="w-full lg:w-1/3 h-[300px]">
            <h4 className="text-md font-medium text-gray-700 text-center mb-2">
              Categories in Ward {selectedWard}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectedCategories}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {selectedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemChart;
