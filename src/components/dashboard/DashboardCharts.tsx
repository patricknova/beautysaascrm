"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react";

const DashboardCharts = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Données simulées pour les graphiques
  const weeklyRevenue = [
    { day: "Lun", amount: 15000, appointments: 8 },
    { day: "Mar", amount: 22000, appointments: 12 },
    { day: "Mer", amount: 18000, appointments: 10 },
    { day: "Jeu", amount: 28000, appointments: 15 },
    { day: "Ven", amount: 35000, appointments: 18 },
    { day: "Sam", amount: 42000, appointments: 22 },
    { day: "Dim", amount: 12000, appointments: 6 },
  ];

  const topServices = [
    {
      name: "Soin du visage",
      count: 45,
      revenue: 67500,
      color: "from-pink-400 to-rose-500",
    },
    {
      name: "Manucure/Pédicure",
      count: 38,
      revenue: 57000,
      color: "from-purple-400 to-violet-500",
    },
    {
      name: "Coiffure",
      count: 32,
      revenue: 96000,
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "Massage",
      count: 28,
      revenue: 42000,
      color: "from-emerald-400 to-teal-500",
    },
  ];

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Revenus de la Semaine</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-4 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="w-full h-2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span>Services Populaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));
  const maxAppointments = Math.max(...weeklyRevenue.map((d) => d.appointments));

  return (
    <div className="space-y-6">
      {/* Revenus hebdomadaires */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Revenus de la Semaine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyRevenue.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {data.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {data.amount.toLocaleString()} FCFA
                    </span>
                    <span className="text-xs text-gray-500">
                      {data.appointments} RDV
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.amount / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Total Semaine
              </span>
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </Badge>
                <span className="font-bold text-emerald-700">
                  {weeklyRevenue
                    .reduce((sum, d) => sum + d.amount, 0)
                    .toLocaleString()}{" "}
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services populaires */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span>Services Populaires</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topServices.map((service, index) => {
              const maxCount = Math.max(...topServices.map((s) => s.count));
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.color}`}
                      />
                      <span className="font-medium text-gray-900">
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {service.revenue.toLocaleString()} FCFA
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.count} services
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${service.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(service.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
