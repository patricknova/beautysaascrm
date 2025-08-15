"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsOverview from "@/components/dashboard/StatsOverview";
import AppointmentsList from "@/components/dashboard/AppointmentsList";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import ClientsList from "@/components/clients/ClientsList";
import AppointmentsCalendar from "@/components/appointments/AppointmentsCalendar";
import SalesModule from "@/components/sales/SalesModule";
import StockManagement from "@/components/stock/StockManagement";

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCharts />
              <AppointmentsList />
            </div>
          </div>
        );
      case "analytics":
        return <AnalyticsDashboard />;
      case "clients":
        return <ClientsList />;
      case "appointments":
        return <AppointmentsCalendar />;
      case "sales":
        return <SalesModule />;
      case "stock":
        return <StockManagement />;
      case "reports":
        return <SalesModule />;
      case "promotions":
        return <SalesModule />;
      default:
        return (
          <div className="space-y-6">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCharts />
              <AppointmentsList />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50">
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </DashboardLayout>
    </div>
  );
}
