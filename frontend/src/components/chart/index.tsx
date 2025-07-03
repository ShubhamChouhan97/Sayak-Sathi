import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Slider from "@mui/material/Slider";

interface ProblemChartProps {
  reportData: {
    analytics?: { ward: number; totalProblems: number }[];
  };
  activeTab: string;
}

const ProblemChart = ({ reportData, activeTab }: ProblemChartProps) => {
  const analytics = reportData?.analytics || [];

  // Find ward number range
  const wardNumbers = analytics.map((a) => a.ward);
  const minWard = Math.min(...wardNumbers);
  const maxWard = Math.max(...wardNumbers);

  // State to control the slider range
  const [wardRange, setWardRange] = useState([minWard, maxWard]);

  // Filter data based on slider
  const filteredData = analytics.filter(
    (a) => a.ward >= wardRange[0] && a.ward <= wardRange[1]
  );

  if (activeTab !== "analysis" || analytics.length === 0) return null;

  return (
    <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Problem Count by Ward
      </h3>

      <div className="mb-4">
        <Slider
          value={wardRange}
          onChange={(_, newValue) => setWardRange(newValue)}
          valueLabelDisplay="auto"
          min={minWard}
          max={maxWard}
        />
        <p className="text-sm text-gray-600">
          Showing wards {wardRange[0]} to {wardRange[1]}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ward" label={{ value: "Ward", position: "insideBottom", dy: 10 }} />
          <YAxis label={{ value: "Problems", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="totalProblems" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProblemChart;
