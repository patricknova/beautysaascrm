"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Save,
  X,
} from "lucide-react";

interface ClientFormProps {
  onClose: () => void;
  client?: any;
}

const ClientForm = ({ onClose, client = null }: ClientFormProps) => {
  const [formData, setFormData] = useState({
    firstName: client?.firstName || "",
    lastName: client?.lastName || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    dateOfBirth: client?.dateOfBirth || "",
    status: client?.status || "Nouveau",
    notes: client?.notes || "",
    preferences: client?.preferences || [],
  });

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    formData.preferences,
  );

  const servicePreferences = [
    "Soin du visage",
    "Manucure",
    "Pédicure",
    "Coiffure",
    "Massage",
    "Épilation",
    "Maquillage",
    "Soins corporels",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour sauvegarder le client
    console.log("Client data:", {
      ...formData,
      preferences: selectedPreferences,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Informations Personnelles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Entrez le prénom"
                className="border-pink-200 focus:border-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Entrez le nom"
                className="border-pink-200 focus:border-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="pl-10 border-pink-200 focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemple.com"
                  className="pl-10 border-pink-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date de Naissance</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="pl-10 border-pink-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut Client</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="border-pink-200 focus:border-purple-400">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nouveau">Nouveau</SelectItem>
                  <SelectItem value="Régulier">Régulier</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Adresse complète"
                className="pl-10 border-pink-200 focus:border-purple-400 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Préférences de services */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Préférences de Services
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {servicePreferences.map((preference) => (
              <Badge
                key={preference}
                variant={
                  selectedPreferences.includes(preference)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPreferences.includes(preference)
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    : "border-pink-200 text-gray-600 hover:bg-pink-50"
                }`}
                onClick={() => togglePreference(preference)}
              >
                {preference}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Observations</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notes sur le client, allergies, préférences spéciales..."
              className="border-pink-200 focus:border-purple-400 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-pink-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {client ? "Modifier" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
