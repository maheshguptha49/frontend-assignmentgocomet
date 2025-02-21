"use client";

import {
  useGetAnalyticsQuery,
  useGetEstimationHoursQuery,
} from "@/app/Components/redux/taskApiSlice";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF6619",
];

const Dashboard = () => {
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetAnalyticsQuery();

  const {
    data: estimationData,
    isLoading: estimationLoading,
    error: estimationError,
  } = useGetEstimationHoursQuery();

  const renderChart = (
    loading: boolean,
    error: boolean,
    chart: React.ReactNode
  ) => {
    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error)
      return (
        <div className="text-center py-4 text-red-500">Error loading data</div>
      );
    return chart;
  };

  const transformCompletedData = (
    data: { date: string; count: number }[] = []
  ) => {
    return data.map((item) => ({ name: item.date, pv: item.count }));
  };

  const transformDueDateData = (
    data: { date: string; count: number }[] = []
  ) => {
    return data.map((item) => ({ name: item.date, uv: item.count }));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Completed Tasks per Day</h2>
        <div className="h-64">
          {renderChart(
            analyticsLoading,
            !!analyticsError,
            <LineChart
              width={500}
              height={300}
              data={transformCompletedData(analyticsData?.completedPerDay)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-GB")
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) =>
                  `Date: ${new Date(date).toLocaleDateString()}`
                }
                formatter={(value) => [`${value} tasks`, "Count"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                name="Completed Tasks"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tasks Due per Day</h2>
        <div className="h-64">
          {renderChart(
            analyticsLoading,
            !!analyticsError,
            <LineChart
              width={500}
              height={300}
              data={transformDueDateData(analyticsData?.dueDatePerDay)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-GB")
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) =>
                  `Date: ${new Date(date).toLocaleDateString()}`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">
          Task Estimation Hours Distribution
        </h2>
        <div className="h-96">
          {renderChart(
            estimationLoading,
            !!estimationError,
            <PieChart width={730} height={250}>
              <Pie
                data={estimationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {estimationData?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} hours`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
