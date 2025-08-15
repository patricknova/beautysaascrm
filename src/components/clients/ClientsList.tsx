"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Star,
  Edit,
  Eye,
  Filter,
} from "lucide-react";
import ClientForm from "./ClientForm";

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const clients = [
    {
      id: 1,
      name: "Marie Dubois",
      phone: "+237 6XX XXX XXX",
      email: "marie.dubois@email.com",
      status: "VIP",
      lastVisit: "2024-01-15",
      totalSpent: 125000,
      visits: 12,
      avatar: "MD",
    },
    {
      id: 2,
      name: "Fatima Ngono",
      phone: "+237 6XX XXX XXX",
      email: "fatima.ngono@email.com",
      status: "Régulier",
      lastVisit: "2024-01-10",
      totalSpent: 85000,
      visits: 8,
      avatar: "FN",
    },
    {
      id: 3,
      name: "Grace Mballa",
      phone: "+237 6XX XXX XXX",
      email: "grace.mballa@email.com",
      status: "Nouveau",
      lastVisit: "2024-01-20",
      totalSpent: 25000,
      visits: 2,
      avatar: "GM",
    },
    {
      id: 4,
      name: "Aminata Sow",
      phone: "+237 6XX XXX XXX",
      email: "aminata.sow@email.com",
      status: "Régulier",
      lastVisit: "2024-01-18",
      totalSpent: 67000,
      visits: 6,
      avatar: "AS",
    },
    {
      id: 5,
      name: "Christelle Biya",
      phone: "+237 6XX XXX XXX",
      email: "christelle.biya@email.com",
      status: "VIP",
      lastVisit: "2024-01-22",
      totalSpent: 180000,
      visits: 15,
      avatar: "CB",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "Régulier":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case "Nouveau":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Gestion des Clients</span>
              <Badge className="bg-purple-100 text-purple-700">
                {clients.length} clients
              </Badge>
            </CardTitle>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouveau Client</DialogTitle>
                </DialogHeader>
                <ClientForm onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, téléphone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-pink-200 focus:border-purple-400"
              />
            </div>

            <div className="flex space-x-2">
              {["all", "Nouveau", "Régulier", "VIP"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={
                    selectedStatus === status
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "border-pink-200 text-gray-600 hover:bg-pink-50"
                  }
                >
                  {status === "all" ? "Tous" : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-pink-100">
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Visite</TableHead>
                <TableHead>Total Dépensé</TableHead>
                <TableHead>Visites</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-pink-50 hover:bg-pink-25"
                >
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
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{client.email}</span>
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
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>
                        {new Date(client.lastVisit).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-emerald-600">
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

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-600 hover:bg-purple-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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

export default ClientsList;
