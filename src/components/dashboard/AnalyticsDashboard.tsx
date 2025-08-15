"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Star,
  Award,
  Filter,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedPractitioner, setSelectedPractitioner] = useState("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Données simulées pour les revenus par service
  const revenueByService = [
    {
      service: "Soin du visage",
      revenue: 285000,
      sessions: 45,
      growth: "+15.2%",
      color: "from-pink-400 to-rose-500",
    },
    {
      service: "Coiffure",
      revenue: 420000,
      sessions: 32,
      growth: "+22.8%",
      color: "from-purple-400 to-violet-500",
    },
    {
      service: "Manucure/Pédicure",
      revenue: 195000,
      sessions: 38,
      growth: "+8.5%",
      color: "from-blue-400 to-cyan-500",
    },
    {
      service: "Massage",
      revenue: 168000,
      sessions: 28,
      growth: "+12.1%",
      color: "from-emerald-400 to-teal-500",
    },
    {
      service: "Épilation",
      revenue: 145000,
      sessions: 35,
      growth: "+5.3%",
      color: "from-amber-400 to-orange-500",
    },
  ];

  // Données simulées pour les revenus par praticien
  const revenueByPractitioner = [
    {
      name: "Sophie Kamga",
      revenue: 320000,
      clients: 42,
      services: 68,
      speciality: "Soins du visage",
      growth: "+18.5%",
    },
    {
      name: "Marie Nkomo",
      revenue: 285000,
      clients: 38,
      services: 55,
      speciality: "Coiffure",
      growth: "+12.3%",
    },
    {
      name: "Aisha Bello",
      revenue: 245000,
      clients: 35,
      services: 62,
      speciality: "Manucure/Pédicure",
      growth: "+9.7%",
    },
    {
      name: "Grace Fouda",
      revenue: 198000,
      clients: 28,
      services: 45,
      speciality: "Massage",
      growth: "+15.2%",
    },
  ];

  // Données simulées pour les top clients
  const topClients = [
    {
      id: 1,
      name: "Christelle Biya",
      totalSpent: 285000,
      visits: 18,
      lastVisit: "2024-01-22",
      status: "VIP",
      favoriteService: "Soin du visage",
      avatar: "CB",
      growth: "+25.3%",
    },
    {
      id: 2,
      name: "Marie Dubois",
      totalSpent: 245000,
      visits: 15,
      lastVisit: "2024-01-20",
      status: "VIP",
      favoriteService: "Coiffure",
      avatar: "MD",
      growth: "+18.7%",
    },
    {
      id: 3,
      name: "Fatima Ngono",
      totalSpent: 195000,
      visits: 12,
      lastVisit: "2024-01-18",
      status: "Régulier",
      favoriteService: "Manucure",
      avatar: "FN",
      growth: "+12.1%",
    },
    {
      id: 4,
      name: "Grace Mballa",
      totalSpent: 165000,
      visits: 10,
      lastVisit: "2024-01-15",
      status: "Régulier",
      favoriteService: "Massage",
      avatar: "GM",
      growth: "+8.9%",
    },
    {
      id: 5,
      name: "Aminata Sow",
      totalSpent: 145000,
      visits: 9,
      lastVisit: "2024-01-12",
      status: "Régulier",
      favoriteService: "Épilation",
      avatar: "AS",
      growth: "+15.4%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "Régulier":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const maxServiceRevenue = Math.max(...revenueByService.map((s) => s.revenue));
  const maxPractitionerRevenue = Math.max(
    ...revenueByPractitioner.map((p) => p.revenue),
  );

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Header avec filtres */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span>Tableau de Bord Analytics</span>
            </CardTitle>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px] border-pink-200">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">3 derniers mois</SelectItem>
                  <SelectItem value="1y">Cette année</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="w-[180px] border-pink-200">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  <SelectItem value="soin">Soin du visage</SelectItem>
                  <SelectItem value="coiffure">Coiffure</SelectItem>
                  <SelectItem value="manucure">Manucure/Pédicure</SelectItem>
                  <SelectItem value="massage">Massage</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedPractitioner}
                onValueChange={setSelectedPractitioner}
              >
                <SelectTrigger className="w-[180px] border-pink-200">
                  <SelectValue placeholder="Praticien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les praticiens</SelectItem>
                  <SelectItem value="sophie">Sophie Kamga</SelectItem>
                  <SelectItem value="marie">Marie Nkomo</SelectItem>
                  <SelectItem value="aisha">Aisha Bello</SelectItem>
                  <SelectItem value="grace">Grace Fouda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Graphiques CA par Service et Praticien */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CA par Service */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span>Chiffre d'Affaires par Service</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByService.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.color}`}
                      />
                      <span className="font-medium text-gray-900">
                        {service.service}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {service.revenue.toLocaleString()} FCFA
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.sessions} sessions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${service.color} h-2 rounded-full transition-all duration-500`}
                        style={{
                          width: `${(service.revenue / maxServiceRevenue) * 100}%`,
                        }}
                      />
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {service.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CA par Praticien */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Performance par Praticien</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByPractitioner.map((practitioner, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {practitioner.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {practitioner.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {practitioner.speciality}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {practitioner.growth}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {practitioner.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">FCFA</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {practitioner.clients}
                      </div>
                      <div className="text-xs text-gray-500">Clients</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">
                        {practitioner.services}
                      </div>
                      <div className="text-xs text-gray-500">Services</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Top Clients par Chiffre d'Affaires</span>
            <Badge className="bg-purple-100 text-purple-700">
              {topClients.length} clients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-pink-100">
                <TableHead>Rang</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Total Dépensé</TableHead>
                <TableHead>Visites</TableHead>
                <TableHead>Service Favori</TableHead>
                <TableHead>Croissance</TableHead>
                <TableHead>Dernière Visite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topClients.map((client, index) => (
                <TableRow
                  key={client.id}
                  className="border-pink-50 hover:bg-pink-25"
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {index === 0 && (
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            1
                          </span>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            2
                          </span>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            3
                          </span>
                        </div>
                      )}
                      {index > 2 && (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {client.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{client.id.toString().padStart(3, "0")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === "VIP" && (
                        <Star className="w-3 h-3 mr-1" />
                      )}
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-600">
                      {client.totalSpent.toLocaleString()} FCFA
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      {client.visits} visites
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {client.favoriteService}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {client.growth}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>
                        {new Date(client.lastVisit).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
