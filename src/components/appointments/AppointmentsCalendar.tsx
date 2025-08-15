"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Scissors,
  Sparkles,
  Heart,
  Bell,
  BellRing,
} from "lucide-react";
import AppointmentForm from "./AppointmentForm";

const AppointmentsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [appointments, setAppointments] = useState<any[]>([]);

  // Charger les rendez-vous depuis localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Données initiales si aucun rendez-vous sauvegardé
      const initialAppointments = [
        {
          id: 1,
          clientName: "Marie Dubois",
          service: "Soin du visage",
          practitioner: "Sophie",
          time: "09:00",
          duration: 60,
          date: new Date().toISOString().split("T")[0],
          status: "confirmed",
          color: "from-pink-400 to-rose-500",
        },
        {
          id: 2,
          clientName: "Fatima Ngono",
          service: "Manucure",
          practitioner: "Aisha",
          time: "10:30",
          duration: 45,
          date: new Date().toISOString().split("T")[0],
          status: "pending",
          color: "from-purple-400 to-violet-500",
        },
        {
          id: 3,
          clientName: "Grace Mballa",
          service: "Coiffure",
          practitioner: "Marie",
          time: "14:00",
          duration: 120,
          date: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split("T")[0];
          })(),
          status: "confirmed",
          color: "from-blue-400 to-cyan-500",
        },
        {
          id: 4,
          clientName: "Aminata Sow",
          service: "Massage",
          practitioner: "Sophie",
          time: "16:00",
          duration: 45,
          date: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split("T")[0];
          })(),
          status: "confirmed",
          color: "from-emerald-400 to-teal-500",
        },
      ];
      setAppointments(initialAppointments);
      localStorage.setItem("appointments", JSON.stringify(initialAppointments));
    }
  }, []);

  // Fonction pour ajouter un nouveau rendez-vous
  const addAppointment = (newAppointment: any) => {
    const appointmentWithId = {
      ...newAppointment,
      id: Date.now(),
      color: getRandomColor(),
    };
    const updatedAppointments = [...appointments, appointmentWithId];
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
  };

  // Fonction pour obtenir une couleur aléatoire
  const getRandomColor = () => {
    const colors = [
      "from-pink-400 to-rose-500",
      "from-purple-400 to-violet-500",
      "from-blue-400 to-cyan-500",
      "from-emerald-400 to-teal-500",
      "from-orange-400 to-red-500",
      "from-indigo-400 to-purple-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const practitioners = [
    {
      name: "Sophie",
      specialty: "Soins du visage & Massage",
      color: "from-pink-400 to-rose-500",
    },
    {
      name: "Aisha",
      specialty: "Manucure & Pédicure",
      color: "from-purple-400 to-violet-500",
    },
    {
      name: "Marie",
      specialty: "Coiffure & Styling",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  // Créneaux horaires (30 minutes)
  const timeSlots = [];
  for (let hour = 8; hour < 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  // Obtenir les jours de la semaine
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getAppointmentsForDateAndTime = (date: Date, time: string) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter(
      (apt) => apt.date === dateStr && apt.time === time,
    );
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    return getAppointmentsForDateAndTime(date, time).length === 0;
  };

  // Push notifications setup
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        setNotificationsEnabled(true);
        // Schedule notifications for upcoming appointments
        scheduleAppointmentReminders();
      }
    }
  };

  const scheduleAppointmentReminders = () => {
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}`,
      );
      const reminderTime = new Date(appointmentDate.getTime() - 60 * 60 * 1000); // 1 hour before
      const now = new Date();

      if (reminderTime > now) {
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          if (notificationsEnabled && Notification.permission === "granted") {
            new Notification(`Rappel de rendez-vous`, {
              body: `${appointment.clientName} - ${appointment.service} dans 1 heure`,
              icon: "/favicon.ico",
              tag: `appointment-${appointment.id}`,
            });
          }
        }, timeUntilReminder);
      }
    });
  };

  const getServiceIcon = (service: string) => {
    if (service.toLowerCase().includes("coiffure"))
      return <Scissors className="w-3 h-3" />;
    if (service.toLowerCase().includes("soin"))
      return <Sparkles className="w-3 h-3" />;
    if (service.toLowerCase().includes("massage"))
      return <Heart className="w-3 h-3" />;
    return <User className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
              <span>Calendrier des Rendez-vous</span>
            </CardTitle>

            <div className="flex items-center space-x-3">
              {/* Notification Toggle */}
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={requestNotificationPermission}
                className={
                  notificationsEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "border-pink-200 text-gray-600 hover:bg-pink-50"
                }
              >
                {notificationsEnabled ? (
                  <BellRing className="w-4 h-4 mr-2" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                {notificationsEnabled
                  ? "Notifications ON"
                  : "Activer Notifications"}
              </Button>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau RDV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Planifier un Rendez-vous</DialogTitle>
                  </DialogHeader>
                  <AppointmentForm
                    onClose={() => setIsFormOpen(false)}
                    selectedDate={selectedDate}
                    selectedTime={selectedTimeSlot}
                    onSave={addAppointment}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Calendar */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>Sélectionner une Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quick Date Selection */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className={`text-xs ${selectedDate.toDateString() === new Date().toDateString() ? "bg-purple-100 border-purple-300 text-purple-700" : "border-pink-200 hover:bg-pink-50"}`}
                >
                  Aujourd'hui
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setSelectedDate(tomorrow);
                  }}
                  className="text-xs border-pink-200 hover:bg-pink-50"
                >
                  Demain
                </Button>
              </div>

              {/* Enhanced Calendar */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCurrentWeek(date); // Sync weekly view with selected date
                  }
                }}
                className="rounded-md border border-pink-200"
                disabled={(date) => {
                  // Disable past dates
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                modifiers={{
                  hasAppointments: (date) => {
                    const dateStr = date.toISOString().split("T")[0];
                    return appointments.some((apt) => apt.date === dateStr);
                  },
                }}
                modifiersStyles={{
                  hasAppointments: {
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "4px",
                  },
                }}
              />

              {/* Selected Date Info */}
              <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="text-sm font-medium text-gray-900">
                  Date sélectionnée:
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {
                    appointments.filter(
                      (apt) =>
                        apt.date === selectedDate.toISOString().split("T")[0],
                    ).length
                  }{" "}
                  rendez-vous programmés
                </div>
              </div>
            </div>

            {/* Practitioners */}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-900">Praticiens</h4>
              {practitioners.map((practitioner, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${practitioner.color}`}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {practitioner.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {practitioner.specialty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Calendar */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {weekDays[0].toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date())}
              >
                Aujourd'hui
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header avec les jours */}
                <div className="grid grid-cols-8 gap-1 mb-2">
                  <div className="p-2 text-sm font-medium text-gray-500">
                    Heure
                  </div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="p-2 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {dayNames[index]}
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          day.toDateString() === new Date().toDateString()
                            ? "text-purple-600"
                            : "text-gray-700"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grille des créneaux */}
                <div className="space-y-1">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 gap-1">
                      <div className="p-2 text-xs text-gray-500 font-medium border-r border-gray-200">
                        {time}
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const dayAppointments = getAppointmentsForDateAndTime(
                          day,
                          time,
                        );
                        const isAvailable = isTimeSlotAvailable(day, time);

                        return (
                          <div
                            key={dayIndex}
                            className={`p-1 min-h-[40px] border border-gray-100 rounded cursor-pointer transition-all duration-200 ${
                              isAvailable
                                ? "hover:bg-pink-50 hover:border-pink-200"
                                : ""
                            }`}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedDate(day);
                                setSelectedTimeSlot(time);
                                setIsFormOpen(true);
                              }
                            }}
                          >
                            {dayAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className={`p-1 rounded text-xs text-white bg-gradient-to-r ${appointment.color} shadow-sm`}
                              >
                                <div className="flex items-center space-x-1">
                                  {getServiceIcon(appointment.service)}
                                  <span className="font-medium truncate">
                                    {appointment.clientName}
                                  </span>
                                </div>
                                <div className="text-xs opacity-90 truncate">
                                  {appointment.service}
                                </div>
                                <div className="text-xs opacity-75">
                                  {appointment.practitioner}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsCalendar;
