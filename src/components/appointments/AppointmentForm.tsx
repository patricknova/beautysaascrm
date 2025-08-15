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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, Scissors, Save, X, Search } from "lucide-react";

interface AppointmentFormProps {
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string | null;
  appointment?: any;
  onSave?: (appointment: any) => void;
}

const AppointmentForm = ({
  onClose,
  selectedDate = new Date(),
  selectedTime = null,
  appointment = null,
  onSave,
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || "",
    clientName: appointment?.clientName || "",
    service: appointment?.service || "",
    practitioner: appointment?.practitioner || "",
    date: appointment?.date || selectedDate.toISOString().split("T")[0],
    time: appointment?.time || selectedTime || "",
    duration: appointment?.duration || 60,
    notes: appointment?.notes || "",
    status: appointment?.status || "pending",
  });

  const [searchClient, setSearchClient] = useState("");
  const [showClientSearch, setShowClientSearch] = useState(false);

  // Données simulées
  const clients = [
    { id: 1, name: "Marie Dubois", phone: "+237 6XX XXX XXX" },
    { id: 2, name: "Fatima Ngono", phone: "+237 6XX XXX XXX" },
    { id: 3, name: "Grace Mballa", phone: "+237 6XX XXX XXX" },
    { id: 4, name: "Aminata Sow", phone: "+237 6XX XXX XXX" },
    { id: 5, name: "Christelle Biya", phone: "+237 6XX XXX XXX" },
  ];

  const services = [
    { name: "Soin du visage", duration: 60, price: 15000 },
    { name: "Manucure", duration: 45, price: 8000 },
    { name: "Pédicure", duration: 60, price: 10000 },
    { name: "Manucure + Pédicure", duration: 90, price: 15000 },
    { name: "Coiffure - Coupe", duration: 60, price: 12000 },
    { name: "Coiffure - Brushing", duration: 45, price: 8000 },
    { name: "Coiffure - Coloration", duration: 120, price: 25000 },
    { name: "Massage relaxant", duration: 45, price: 12000 },
    { name: "Massage thérapeutique", duration: 60, price: 18000 },
    { name: "Épilation jambes", duration: 30, price: 8000 },
    { name: "Maquillage", duration: 45, price: 15000 },
  ];

  const practitioners = [
    { name: "Sophie", specialty: "Soins du visage & Massage" },
    { name: "Aisha", specialty: "Manucure & Pédicure" },
    { name: "Marie", specialty: "Coiffure & Styling" },
  ];

  // Créneaux horaires
  const timeSlots = [];
  for (let hour = 8; hour < 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.phone.includes(searchClient),
  );

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-update duration when service changes
    if (field === "service") {
      const selectedService = services.find((s) => s.name === value);
      if (selectedService) {
        setFormData((prev) => ({
          ...prev,
          duration: selectedService.duration,
        }));
      }
    }
  };

  const selectClient = (client: any) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.id.toString(),
      clientName: client.name,
    }));
    setSearchClient(client.name);
    setShowClientSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs requis
    if (
      !formData.clientName ||
      !formData.service ||
      !formData.practitioner ||
      !formData.date ||
      !formData.time
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const appointmentData = {
      ...formData,
      clientId: formData.clientId || Date.now().toString(),
    };

    console.log("Appointment data:", appointmentData);

    // Sauvegarder le rendez-vous
    if (onSave) {
      onSave(appointmentData);
    }

    // Afficher un message de confirmation
    alert(
      `Rendez-vous planifié avec succès pour ${formData.clientName} le ${new Date(formData.date + "T00:00:00").toLocaleDateString("fr-FR")} à ${formData.time}`,
    );

    onClose();
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du client */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Client</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Rechercher un client *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="client"
                  value={searchClient}
                  onChange={(e) => {
                    setSearchClient(e.target.value);
                    setShowClientSearch(true);
                  }}
                  onFocus={() => setShowClientSearch(true)}
                  placeholder="Nom ou téléphone du client"
                  className="pl-10 border-pink-200 focus:border-purple-400"
                  required
                />

                {showClientSearch && searchClient && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-pink-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-pink-50 cursor-pointer border-b border-pink-100 last:border-b-0"
                        onClick={() => selectClient(client)}
                      >
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.phone}
                        </div>
                      </div>
                    ))}
                    {filteredClients.length === 0 && (
                      <div className="p-3 text-gray-500 text-center">
                        Aucun client trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails du rendez-vous */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Scissors className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du Service
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => handleInputChange("service", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-pink-400">
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="outline" className="text-xs">
                              {service.duration}min
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {service.price.toLocaleString()} FCFA
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="practitioner">Praticien *</Label>
                <Select
                  value={formData.practitioner}
                  onValueChange={(value) =>
                    handleInputChange("practitioner", value)
                  }
                >
                  <SelectTrigger className="border-purple-200 focus:border-pink-400">
                    <SelectValue placeholder="Sélectionner un praticien" />
                  </SelectTrigger>
                  <SelectContent>
                    {practitioners.map((practitioner) => (
                      <SelectItem
                        key={practitioner.name}
                        value={practitioner.name}
                      >
                        <div>
                          <div className="font-medium">{practitioner.name}</div>
                          <div className="text-xs text-gray-500">
                            {practitioner.specialty}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date et heure */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Planification
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="space-y-2">
                  {/* Quick Date Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        handleInputChange("date", today);
                      }}
                      className="text-xs border-pink-200 hover:bg-pink-50"
                    >
                      Aujourd'hui
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        handleInputChange(
                          "date",
                          tomorrow.toISOString().split("T")[0],
                        );
                      }}
                      className="text-xs border-pink-200 hover:bg-pink-50"
                    >
                      Demain
                    </Button>
                  </div>

                  {/* Date Input with enhanced styling */}
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="border-pink-200 focus:border-purple-400 pl-10"
                      min={new Date().toISOString().split("T")[0]} // Prevent past dates
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Date Display */}
                  {formData.date && (
                    <div className="text-xs text-purple-600 font-medium">
                      {new Date(formData.date + "T00:00:00").toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <div className="space-y-2">
                  {/* Quick Time Buttons */}
                  <div className="grid grid-cols-3 gap-1">
                    {["09:00", "14:00", "16:00"].map((quickTime) => (
                      <Button
                        key={quickTime}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("time", quickTime)}
                        className={`text-xs ${
                          formData.time === quickTime
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        {quickTime}
                      </Button>
                    ))}
                  </div>

                  {/* Time Select with enhanced display */}
                  <div className="relative">
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        handleInputChange("time", value)
                      }
                    >
                      <SelectTrigger className="border-pink-200 focus:border-purple-400 pl-10">
                        <SelectValue placeholder="Sélectionner l'heure" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timeSlots.map((time) => {
                          const hour = parseInt(time.split(":")[0]);
                          const period =
                            hour < 12
                              ? "Matin"
                              : hour < 17
                                ? "Après-midi"
                                : "Soir";
                          const isPopular = [
                            "09:00",
                            "10:00",
                            "14:00",
                            "15:00",
                            "16:00",
                          ].includes(time);

                          return (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{time}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {period}
                                  </span>
                                  {isPopular && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-pink-50 text-pink-600"
                                    >
                                      Populaire
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  className="border-pink-200 focus:border-purple-400"
                  min="15"
                  step="15"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes & Instructions</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Notes spéciales, préparations nécessaires, allergies..."
                className="border-purple-200 focus:border-pink-400 min-h-[80px]"
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
            {appointment ? "Modifier" : "Planifier"} RDV
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};

export default AppointmentForm;
