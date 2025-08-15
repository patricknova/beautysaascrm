"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
} from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Clients Total",
      value: "247",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "RDV Aujourd'hui",
      value: "18",
      change: "+3",
      changeType: "positive",
      icon: Calendar,
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Chiffre d'Affaires",
      value: "125,400 FCFA",
      change: "+8.2%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Croissance",
      value: "23.5%",
      change: "+2.1%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const alerts = [
    {
      type: "stock",
      message: "5 produits en rupture de stock",
      severity: "high",
    },
    {
      type: "appointment",
      message: "3 rendez-vous à confirmer",
      severity: "medium",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Badge
                    variant={
                      stat.changeType === "positive" ? "default" : "destructive"
                    }
                    className={`text-xs ${
                      stat.changeType === "positive"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Alertes & Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="flex items-center space-x-3">
                  {alert.type === "stock" ? (
                    <Package className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-amber-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </span>
                </div>
                <Badge
                  variant={
                    alert.severity === "high" ? "destructive" : "secondary"
                  }
                  className={
                    alert.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {alert.severity === "high" ? "Urgent" : "Modéré"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
