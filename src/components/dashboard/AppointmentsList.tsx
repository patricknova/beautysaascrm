"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";

const AppointmentsList = () => {
  const appointments = [
    {
      id: 1,
      client: "Marie Dubois",
      phone: "+237 6XX XXX XXX",
      service: "Soin du visage",
      time: "09:00",
      duration: "60 min",
      status: "confirmed",
      practitioner: "Sophie",
      avatar: "MD",
    },
    {
      id: 2,
      client: "Fatima Ngono",
      phone: "+237 6XX XXX XXX",
      service: "Manucure + Pédicure",
      time: "10:30",
      duration: "90 min",
      status: "pending",
      practitioner: "Aisha",
      avatar: "FN",
    },
    {
      id: 3,
      client: "Grace Mballa",
      phone: "+237 6XX XXX XXX",
      service: "Coiffure",
      time: "14:00",
      duration: "120 min",
      status: "confirmed",
      practitioner: "Marie",
      avatar: "GM",
    },
    {
      id: 4,
      client: "Aminata Sow",
      phone: "+237 6XX XXX XXX",
      service: "Massage relaxant",
      time: "16:00",
      duration: "45 min",
      status: "pending",
      practitioner: "Sophie",
      avatar: "AS",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Rendez-vous du Jour</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {appointment.avatar}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">
                      {appointment.client}
                    </h4>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </span>
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{appointment.practitioner}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {appointment.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
