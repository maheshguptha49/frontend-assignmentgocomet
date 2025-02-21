import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TaskResponseData,
  Task,
  AnalyticsData,
  EstimationHoursData,
} from "../types";

export const taskApiSlice = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTasks: builder.query<
      TaskResponseData,
      {
        page: number;
        limit: number;
        filters?: Partial<Task>;
        sortBy?: keyof Task;
        sortOrder?: "asc" | "desc";
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/tasks",
        params: {
          page: params.page,
          limit: params.limit,
          ...params.filters,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          search: params.search,
        },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (newItems.currentPage === 1) return newItems;
        return {
          ...currentCache,
          data: [...currentCache.data, ...newItems.data],
          total: newItems.total,
          totalPages: newItems.totalPages,
          currentPage: newItems.currentPage,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.filters !== previousArg?.filters ||
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.search !== previousArg?.search
        );
      },
    }),

    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
      providesTags: ["Analytics"],
    }),

    getEstimationHours: builder.query<EstimationHoursData[], void>({
      query: () => "/analytics/estimation-hours",
      providesTags: ["Analytics"],
    }),
  }),
  tagTypes: ["Tasks", "Analytics"],
});

export const {
  useGetTasksQuery,
  useGetAnalyticsQuery,
  useGetEstimationHoursQuery,
} = taskApiSlice;
