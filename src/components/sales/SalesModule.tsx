"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  X,
  Package,
  DollarSign,
  FileText,
  Check,
  Download,
  BarChart3,
  Calendar,
  TrendingUp,
  Percent,
  Gift,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  PaymentManager,
  PaymentRequest,
  PaymentResponse,
  WebhookPayload,
  getPaymentStatusFromWebhook,
} from "@/lib/payment-apis";

interface CartItem {
  id: number;
  name: string;
  type: "product" | "service";
  price: number;
  quantity: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const SalesModule = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Client, 2: Products, 3: Payment
  const [amountPaid, setAmountPaid] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState("sales"); // sales, reports, promotions
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [reportDateRange, setReportDateRange] = useState({
    start: "",
    end: "",
  });
  const [promotionForm, setPromotionForm] = useState({
    name: "",
    type: "percentage", // percentage or fixed
    value: "",
    code: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    active: true,
  });

  // Payment processing states
  const [paymentManager] = useState(() => new PaymentManager());
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [paymentError, setPaymentError] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [paymentProvider, setPaymentProvider] = useState<
    "orange" | "mtn" | null
  >(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentPollingInterval, setPaymentPollingInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Données simulées
  const products = [
    {
      id: 1,
      name: "Crème hydratante visage",
      price: 15000,
      stock: 25,
      category: "Soins",
    },
    {
      id: 2,
      name: "Vernis à ongles rouge",
      price: 3500,
      stock: 40,
      category: "Manucure",
    },
    {
      id: 3,
      name: "Shampooing réparateur",
      price: 8000,
      stock: 15,
      category: "Cheveux",
    },
    {
      id: 4,
      name: "Masque purifiant",
      price: 12000,
      stock: 8,
      category: "Soins",
    },
    {
      id: 5,
      name: "Huile de massage",
      price: 18000,
      stock: 12,
      category: "Massage",
    },
    {
      id: 6,
      name: "Fond de teint",
      price: 22000,
      stock: 30,
      category: "Maquillage",
    },
    {
      id: 7,
      name: "Rouge à lèvres",
      price: 8500,
      stock: 45,
      category: "Maquillage",
    },
    {
      id: 8,
      name: "Après-shampooing",
      price: 6500,
      stock: 20,
      category: "Cheveux",
    },
  ];

  const services = [
    { id: 101, name: "Soin du visage complet", price: 25000, duration: 90 },
    { id: 102, name: "Manucure classique", price: 8000, duration: 45 },
    { id: 103, name: "Pédicure spa", price: 12000, duration: 60 },
    { id: 104, name: "Massage relaxant", price: 18000, duration: 60 },
    {
      id: 105,
      name: "Coiffure - Coupe & Brushing",
      price: 15000,
      duration: 75,
    },
    { id: 106, name: "Maquillage événement", price: 20000, duration: 60 },
    { id: 107, name: "Épilation jambes complètes", price: 10000, duration: 45 },
    { id: 108, name: "Coloration cheveux", price: 35000, duration: 120 },
  ];

  const clients = [
    {
      id: 1,
      name: "Marie Dubois",
      phone: "+237 6XX XXX XXX",
      email: "marie.dubois@email.com",
    },
    {
      id: 2,
      name: "Fatima Ngono",
      phone: "+237 6XX XXX XXX",
      email: "fatima.ngono@email.com",
    },
    {
      id: 3,
      name: "Grace Mballa",
      phone: "+237 6XX XXX XXX",
      email: "grace.mballa@email.com",
    },
    {
      id: 4,
      name: "Aminata Sow",
      phone: "+237 6XX XXX XXX",
      email: "aminata.sow@email.com",
    },
    {
      id: 5,
      name: "Christelle Biya",
      phone: "+237 6XX XXX XXX",
      email: "christelle.biya@email.com",
    },
  ];

  const recentSales = [
    {
      id: 1,
      client: "Marie Dubois",
      items: ["Soin du visage", "Crème hydratante"],
      total: 40000,
      payment: "Orange Money",
      date: "2024-01-22",
      time: "14:30",
    },
    {
      id: 2,
      client: "Fatima Ngono",
      items: ["Manucure", "Vernis rouge"],
      total: 11500,
      payment: "Cash",
      date: "2024-01-22",
      time: "11:15",
    },
    {
      id: 3,
      client: "Grace Mballa",
      items: ["Coiffure complète"],
      total: 15000,
      payment: "MTN Money",
      date: "2024-01-21",
      time: "16:45",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.category.toLowerCase().includes(searchProduct.toLowerCase()),
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchProduct.toLowerCase()),
  );

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.phone.includes(searchClient),
  );

  const addToCart = (item: any, type: "product" | "service") => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.type === type,
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === type
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                total: (cartItem.quantity + 1) * cartItem.price,
              }
            : cartItem,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          type,
          price: item.price,
          quantity: 1,
          total: item.price,
        },
      ]);
    }
  };

  const updateQuantity = (
    id: number,
    type: "product" | "service",
    newQuantity: number,
  ) => {
    if (newQuantity === 0) {
      removeFromCart(id, type);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item,
      ),
    );
  };

  const removeFromCart = (id: number, type: "product" | "service") => {
    setCart(cart.filter((item) => !(item.id === id && item.type === type)));
  };

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchClient(client.name);
    setShowClientSearch(false);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const resetSale = () => {
    setCart([]);
    setSelectedClient(null);
    setPaymentMethod("");
    setSearchClient("");
    setSearchProduct("");
    setCurrentStep(1);
    setAmountPaid("");
    setPhoneNumber("");
    setIsNewSaleOpen(false);
    setPaymentStatus("idle");
    setPaymentError("");
    setTransactionId("");
    setPaymentProvider(null);
    setShowPaymentDialog(false);
    if (paymentPollingInterval) {
      clearInterval(paymentPollingInterval);
      setPaymentPollingInterval(null);
    }
  };

  const completeSale = async () => {
    if (paymentMethod === "cash") {
      // Handle cash payment immediately
      console.log("Cash sale completed:", {
        client: selectedClient,
        items: cart,
        total: getCartTotal(),
        paymentMethod,
        amountPaid,
      });
      alert("Vente finalisée avec succès! Facture générée.");
      resetSale();
      return;
    }

    // Handle mobile money payments
    if (
      (paymentMethod === "orange" || paymentMethod === "mtn") &&
      phoneNumber
    ) {
      await processDigitalPayment();
    }
  };

  const processDigitalPayment = async () => {
    if (!selectedClient || !phoneNumber || !paymentMethod) return;

    setPaymentStatus("processing");
    setPaymentError("");
    setShowPaymentDialog(true);

    const provider = paymentMethod as "orange" | "mtn";
    setPaymentProvider(provider);

    const paymentRequest: PaymentRequest = {
      amount: getCartTotal(),
      phoneNumber: phoneNumber,
      reference: `SALE_${Date.now()}`,
      description: `Achat institut de beauté - ${cart.length} articles`,
      callbackUrl: window.location.origin,
    };

    try {
      const response = await paymentManager.processPayment(
        provider,
        paymentRequest,
      );

      if (response.success && response.transactionId) {
        setTransactionId(response.transactionId);
        // Start polling for payment status
        startPaymentPolling(provider, response.transactionId);
      } else {
        setPaymentStatus("failed");
        setPaymentError(response.message);
      }
    } catch (error: any) {
      setPaymentStatus("failed");
      setPaymentError(error.message || "Erreur lors du traitement du paiement");
    }
  };

  const startPaymentPolling = (provider: "orange" | "mtn", txId: string) => {
    const interval = setInterval(async () => {
      // First check if we have a webhook response
      const webhookStatus = getPaymentStatusFromWebhook(txId);
      if (webhookStatus) {
        clearInterval(interval);
        setPaymentPollingInterval(null);
        handlePaymentResult(
          webhookStatus.status === "success",
          webhookStatus.errorMessage,
        );
        return;
      }

      // If no webhook, poll the API
      try {
        const statusResponse = await paymentManager.checkStatus(provider, txId);
        if (statusResponse.status !== "pending") {
          clearInterval(interval);
          setPaymentPollingInterval(null);
          handlePaymentResult(statusResponse.success, statusResponse.message);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 3000); // Poll every 3 seconds

    setPaymentPollingInterval(interval);

    // Stop polling after 5 minutes
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPaymentPollingInterval(null);
        if (paymentStatus === "processing") {
          setPaymentStatus("failed");
          setPaymentError("Timeout: Le paiement a pris trop de temps");
        }
      }
    }, 300000);
  };

  const handlePaymentResult = (success: boolean, message?: string) => {
    if (success) {
      setPaymentStatus("success");
      // Save the sale
      const saleData = {
        id: Date.now(),
        client: selectedClient?.name,
        items: cart.map((item) => item.name),
        total: getCartTotal(),
        payment: paymentMethod === "orange" ? "Orange Money" : "MTN Money",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        transactionId,
      };

      // In a real app, this would be saved to a database
      const sales = JSON.parse(localStorage.getItem("sales") || "[]");
      sales.unshift(saleData);
      localStorage.setItem("sales", JSON.stringify(sales));

      setTimeout(() => {
        resetSale();
      }, 3000);
    } else {
      setPaymentStatus("failed");
      setPaymentError(message || "Le paiement a échoué");
    }
  };

  // Listen for webhook events
  useEffect(() => {
    const handleWebhookEvent = (event: CustomEvent<WebhookPayload>) => {
      const payload = event.detail;
      if (payload.transactionId === transactionId) {
        if (paymentPollingInterval) {
          clearInterval(paymentPollingInterval);
          setPaymentPollingInterval(null);
        }
        handlePaymentResult(payload.status === "success", payload.errorMessage);
      }
    };

    window.addEventListener(
      "paymentWebhook",
      handleWebhookEvent as EventListener,
    );
    return () => {
      window.removeEventListener(
        "paymentWebhook",
        handleWebhookEvent as EventListener,
      );
      if (paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
      }
    };
  }, [transactionId, paymentPollingInterval]);

  const retryPayment = () => {
    setPaymentStatus("idle");
    setPaymentError("");
    setTransactionId("");
    setShowPaymentDialog(false);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "orange":
        return <Smartphone className="w-4 h-4" />;
      case "mtn":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Orange Money":
        return "bg-orange-100 text-orange-700";
      case "MTN Money":
        return "bg-yellow-100 text-yellow-700";
      case "Cash":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Promotions data
  const promotions = [
    {
      id: 1,
      name: "Réduction Nouvelle Cliente",
      type: "percentage",
      value: 20,
      code: "NOUVELLE20",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      minAmount: 10000,
      active: true,
      usageCount: 15,
    },
    {
      id: 2,
      name: "Forfait Beauté",
      type: "fixed",
      value: 5000,
      code: "BEAUTE5K",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      minAmount: 25000,
      active: true,
      usageCount: 8,
    },
  ];

  // Export to Excel function
  const exportToExcel = async (data: any[], filename: string) => {
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'export Excel");
    }
  };

  // Generate sales report
  const generateSalesReport = () => {
    const reportData = recentSales.map((sale) => ({
      Date: sale.date,
      Heure: sale.time,
      Client: sale.client,
      Articles: sale.items.join(", "),
      "Total (FCFA)": sale.total,
      Paiement: sale.payment,
    }));

    exportToExcel(
      reportData,
      `rapport-ventes-${new Date().toISOString().split("T")[0]}`,
    );
  };

  // Generate products report
  const generateProductsReport = () => {
    const reportData = products.map((product) => ({
      Produit: product.name,
      Catégorie: product.category,
      "Prix (FCFA)": product.price,
      Stock: product.stock,
      Statut: product.stock < 10 ? "Stock faible" : "En stock",
    }));

    exportToExcel(
      reportData,
      `rapport-produits-${new Date().toISOString().split("T")[0]}`,
    );
  };

  // Generate clients report
  const generateClientsReport = () => {
    const reportData = clients.map((client) => ({
      Nom: client.name,
      Téléphone: client.phone,
      Email: client.email,
    }));

    exportToExcel(
      reportData,
      `rapport-clients-${new Date().toISOString().split("T")[0]}`,
    );
  };

  // Apply promotion
  const applyPromotion = (promoCode: string) => {
    const promotion = promotions.find((p) => p.code === promoCode && p.active);
    if (promotion) {
      const total = getCartTotal();
      if (total >= promotion.minAmount) {
        const discount =
          promotion.type === "percentage"
            ? (total * promotion.value) / 100
            : promotion.value;
        return Math.min(discount, total);
      }
    }
    return 0;
  };

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New promotion:", promotionForm);
    setIsPromotionOpen(false);
    setPromotionForm({
      name: "",
      type: "percentage",
      value: "",
      code: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      active: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
              <span>Module de Vente</span>
            </CardTitle>

            <div className="flex items-center space-x-3">
              {/* Tab Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeTab === "sales" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("sales")}
                  className={
                    activeTab === "sales"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "border-pink-200 text-gray-600 hover:bg-pink-50"
                  }
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ventes
                </Button>
                <Button
                  variant={activeTab === "reports" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("reports")}
                  className={
                    activeTab === "reports"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                      : "border-blue-200 text-gray-600 hover:bg-blue-50"
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Rapports
                </Button>
                <Button
                  variant={activeTab === "promotions" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("promotions")}
                  className={
                    activeTab === "promotions"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "border-emerald-200 text-gray-600 hover:bg-emerald-50"
                  }
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Promotions
                </Button>
              </div>

              {activeTab === "sales" && (
                <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle Vente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                        <span>Nouvelle Vente</span>
                      </DialogTitle>
                    </DialogHeader>

                    {/* Steps indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentStep >= step
                                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {currentStep > step ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              step
                            )}
                          </div>
                          {step < 3 && (
                            <div
                              className={`w-12 h-1 mx-2 ${
                                currentStep > step
                                  ? "bg-gradient-to-r from-pink-500 to-purple-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Panel - Client & Products */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Client Selection */}
                        {currentStep >= 1 && (
                          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <User className="w-5 h-5 text-purple-600" />
                                <span>1. Sélectionner le Client</span>
                                {selectedClient && (
                                  <Check className="w-5 h-5 text-green-600" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {!selectedClient ? (
                                <div className="space-y-2">
                                  <Label>Rechercher un client</Label>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                      value={searchClient}
                                      onChange={(e) => {
                                        setSearchClient(e.target.value);
                                        setShowClientSearch(true);
                                      }}
                                      onFocus={() => setShowClientSearch(true)}
                                      placeholder="Nom ou téléphone du client"
                                      className="pl-10 border-pink-200 focus:border-purple-400"
                                    />

                                    {showClientSearch && searchClient && (
                                      <div className="absolute z-10 w-full mt-1 bg-white border border-pink-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredClients.map((client) => (
                                          <div
                                            key={client.id}
                                            className="p-3 hover:bg-pink-50 cursor-pointer border-b border-pink-100 last:border-b-0"
                                            onClick={() => {
                                              selectClient(client);
                                              setCurrentStep(2);
                                            }}
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
                              ) : (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-200">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {selectedClient.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {selectedClient.phone}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedClient(null);
                                      setSearchClient("");
                                      setCurrentStep(1);
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Step 2: Products & Services */}
                        {currentStep >= 2 && (
                          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <Package className="w-5 h-5 text-purple-600" />
                                <span>2. Ajouter Produits & Services</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    value={searchProduct}
                                    onChange={(e) =>
                                      setSearchProduct(e.target.value)
                                    }
                                    placeholder="Rechercher produits ou services..."
                                    className="pl-10 border-purple-200 focus:border-pink-400"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Products */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                      Produits
                                    </h4>
                                    <ScrollArea className="h-64">
                                      <div className="space-y-2">
                                        {filteredProducts.map((product) => (
                                          <div
                                            key={product.id}
                                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-100 hover:shadow-sm"
                                          >
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900">
                                                {product.name}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {product.category}
                                              </div>
                                              <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-sm font-bold text-emerald-600">
                                                  {product.price.toLocaleString()}{" "}
                                                  FCFA
                                                </span>
                                                <Badge
                                                  variant="outline"
                                                  className={
                                                    product.stock < 10
                                                      ? "border-red-200 text-red-700"
                                                      : "border-green-200 text-green-700"
                                                  }
                                                >
                                                  Stock: {product.stock}
                                                </Badge>
                                              </div>
                                            </div>
                                            <Button
                                              size="sm"
                                              onClick={() =>
                                                addToCart(product, "product")
                                              }
                                              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                                              disabled={product.stock === 0}
                                            >
                                              <Plus className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>

                                  {/* Services */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                      Services
                                    </h4>
                                    <ScrollArea className="h-64">
                                      <div className="space-y-2">
                                        {filteredServices.map((service) => (
                                          <div
                                            key={service.id}
                                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:shadow-sm"
                                          >
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900">
                                                {service.name}
                                              </div>
                                              <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-sm font-bold text-emerald-600">
                                                  {service.price.toLocaleString()}{" "}
                                                  FCFA
                                                </span>
                                                <Badge
                                                  variant="outline"
                                                  className="border-blue-200 text-blue-700"
                                                >
                                                  {service.duration}min
                                                </Badge>
                                              </div>
                                            </div>
                                            <Button
                                              size="sm"
                                              onClick={() =>
                                                addToCart(service, "service")
                                              }
                                              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                                            >
                                              <Plus className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Right Panel - Cart & Payment */}
                      <div className="space-y-6">
                        {/* Cart */}
                        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Panier</span>
                              <Badge className="bg-purple-100 text-purple-700">
                                {cart.length} articles
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {cart.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Panier vide</p>
                              </div>
                            ) : (
                              <ScrollArea className="h-64">
                                <div className="space-y-3">
                                  {cart.map((item, index) => (
                                    <div
                                      key={`${item.type}-${item.id}-${index}`}
                                      className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900 text-sm">
                                          {item.name}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                          {item.type}
                                        </div>
                                        <div className="text-sm font-bold text-emerald-600">
                                          {item.total.toLocaleString()} FCFA
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            updateQuantity(
                                              item.id,
                                              item.type,
                                              item.quantity - 1,
                                            )
                                          }
                                          className="w-6 h-6 p-0"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-sm font-medium w-6 text-center">
                                          {item.quantity}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            updateQuantity(
                                              item.id,
                                              item.type,
                                              item.quantity + 1,
                                            )
                                          }
                                          className="w-6 h-6 p-0"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            removeFromCart(item.id, item.type)
                                          }
                                          className="w-6 h-6 p-0 text-red-600 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            )}

                            {cart.length > 0 && (
                              <>
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between text-lg font-bold">
                                  <span>Total:</span>
                                  <span className="text-emerald-600">
                                    {getCartTotal().toLocaleString()} FCFA
                                  </span>
                                </div>

                                {selectedClient && cart.length > 0 && (
                                  <Button
                                    onClick={() => setCurrentStep(3)}
                                    className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                                  >
                                    Procéder au Paiement
                                  </Button>
                                )}
                              </>
                            )}
                          </CardContent>
                        </Card>

                        {/* Step 3: Payment */}
                        {currentStep >= 3 && cart.length > 0 && (
                          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <span>3. Paiement</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label>Méthode de paiement *</Label>
                                <Select
                                  value={paymentMethod}
                                  onValueChange={setPaymentMethod}
                                >
                                  <SelectTrigger className="border-emerald-200 focus:border-teal-400">
                                    <SelectValue placeholder="Sélectionner la méthode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">
                                      <div className="flex items-center space-x-2">
                                        <Banknote className="w-4 h-4" />
                                        <span>Cash</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="orange">
                                      <div className="flex items-center space-x-2">
                                        <Smartphone className="w-4 h-4 text-orange-600" />
                                        <span>Orange Money</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="mtn">
                                      <div className="flex items-center space-x-2">
                                        <Smartphone className="w-4 h-4 text-yellow-600" />
                                        <span>MTN Money</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {(paymentMethod === "orange" ||
                                paymentMethod === "mtn") && (
                                <div>
                                  <Label>Numéro de téléphone</Label>
                                  <Input
                                    value={phoneNumber}
                                    onChange={(e) =>
                                      setPhoneNumber(e.target.value)
                                    }
                                    placeholder="+237 6XX XXX XXX"
                                    className="border-emerald-200 focus:border-teal-400"
                                  />
                                </div>
                              )}

                              <div>
                                <Label>Montant reçu</Label>
                                <Input
                                  value={amountPaid}
                                  onChange={(e) =>
                                    setAmountPaid(e.target.value)
                                  }
                                  placeholder="Montant en FCFA"
                                  type="number"
                                  className="border-emerald-200 focus:border-teal-400"
                                />
                              </div>

                              {amountPaid &&
                                parseInt(amountPaid) > getCartTotal() && (
                                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-sm font-medium text-blue-900">
                                      Monnaie à rendre:{" "}
                                      {(
                                        parseInt(amountPaid) - getCartTotal()
                                      ).toLocaleString()}{" "}
                                      FCFA
                                    </div>
                                  </div>
                                )}

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setCurrentStep(2)}
                                  className="flex-1"
                                >
                                  Retour
                                </Button>
                                <Button
                                  onClick={completeSale}
                                  disabled={
                                    !paymentMethod ||
                                    (!amountPaid && paymentMethod === "cash") ||
                                    ((paymentMethod === "orange" ||
                                      paymentMethod === "mtn") &&
                                      !phoneNumber) ||
                                    paymentStatus === "processing"
                                  }
                                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
                                >
                                  {paymentStatus === "processing" ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Receipt className="w-4 h-4 mr-2" />
                                  )}
                                  {paymentStatus === "processing"
                                    ? "Traitement..."
                                    : "Finaliser"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Payment Processing Dialog */}
              <Dialog
                open={showPaymentDialog}
                onOpenChange={(open) => {
                  if (!open && paymentStatus !== "processing") {
                    setShowPaymentDialog(false);
                    if (paymentStatus !== "success") {
                      setPaymentStatus("idle");
                    }
                  }
                }}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      {paymentProvider === "orange" ? (
                        <Smartphone className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Smartphone className="w-5 h-5 text-yellow-600" />
                      )}
                      <span>
                        {paymentProvider === "orange"
                          ? "Orange Money"
                          : "MTN Money"}
                      </span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {paymentStatus === "processing" && (
                      <div className="text-center py-6">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                        <h3 className="text-lg font-semibold mb-2">
                          Traitement du paiement
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Veuillez confirmer le paiement sur votre téléphone
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Montant:</strong>{" "}
                            {getCartTotal().toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-blue-800">
                            <strong>Numéro:</strong> {phoneNumber}
                          </p>
                          {transactionId && (
                            <p className="text-xs text-blue-600 mt-2">
                              ID: {transactionId}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentStatus === "success" && (
                      <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                        <h3 className="text-lg font-semibold mb-2 text-green-800">
                          Paiement réussi!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          La vente a été finalisée avec succès
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Montant:</strong>{" "}
                            {getCartTotal().toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-green-800">
                            <strong>Transaction:</strong> {transactionId}
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentStatus === "failed" && (
                      <div className="text-center py-6">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                        <h3 className="text-lg font-semibold mb-2 text-red-800">
                          Paiement échoué
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {paymentError ||
                            "Une erreur est survenue lors du paiement"}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowPaymentDialog(false)}
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={retryPayment}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                          >
                            Réessayer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {activeTab === "promotions" && (
                <Dialog
                  open={isPromotionOpen}
                  onOpenChange={setIsPromotionOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle Promotion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Créer une Promotion</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handlePromotionSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nom de la promotion *</Label>
                          <Input
                            value={promotionForm.name}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Ex: Réduction Nouvelle Cliente"
                            required
                          />
                        </div>
                        <div>
                          <Label>Code promo *</Label>
                          <Input
                            value={promotionForm.code}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="Ex: NOUVELLE20"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Type de réduction</Label>
                          <Select
                            value={promotionForm.type}
                            onValueChange={(value) =>
                              setPromotionForm({
                                ...promotionForm,
                                type: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Pourcentage (%)
                              </SelectItem>
                              <SelectItem value="fixed">
                                Montant fixe (FCFA)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Valeur *</Label>
                          <Input
                            type="number"
                            value={promotionForm.value}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                value: e.target.value,
                              })
                            }
                            placeholder={
                              promotionForm.type === "percentage"
                                ? "20"
                                : "5000"
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <Input
                            type="date"
                            value={promotionForm.startDate}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <Input
                            type="date"
                            value={promotionForm.endDate}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Montant minimum (FCFA)</Label>
                        <Input
                          type="number"
                          value={promotionForm.minAmount}
                          onChange={(e) =>
                            setPromotionForm({
                              ...promotionForm,
                              minAmount: e.target.value,
                            })
                          }
                          placeholder="10000"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPromotionOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        >
                          Créer Promotion
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content based on active tab */}
      {activeTab === "sales" && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Ventes Récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-pink-100">
                  <TableHead>Client</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow
                    key={sale.id}
                    className="border-pink-50 hover:bg-pink-25"
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {sale.client}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {sale.items.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="mr-1 text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-emerald-600">
                        {sale.total.toLocaleString()} FCFA
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(sale.payment)}>
                        {getPaymentMethodIcon(sale.payment.toLowerCase())}
                        <span className="ml-1">{sale.payment}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(sale.date).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-gray-500">{sale.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-600 hover:bg-purple-50"
                      >
                        <Receipt className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* Report Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Rapports Avancés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Rapport des Ventes
                        </h3>
                        <p className="text-sm text-gray-500">
                          Export des ventes récentes
                        </p>
                      </div>
                      <Button
                        onClick={generateSalesReport}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Rapport des Produits
                        </h3>
                        <p className="text-sm text-gray-500">
                          Inventaire et stocks
                        </p>
                      </div>
                      <Button
                        onClick={generateProductsReport}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Rapport des Clients
                        </h3>
                        <p className="text-sm text-gray-500">
                          Base de données clients
                        </p>
                      </div>
                      <Button
                        onClick={generateClientsReport}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Statistiques de Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Ventes ce mois</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    2.4M
                  </div>
                  <div className="text-sm text-gray-600">CA mensuel (FCFA)</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Clients actifs</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    15.2K
                  </div>
                  <div className="text-sm text-gray-600">
                    Panier moyen (FCFA)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === "promotions" && (
        <div className="space-y-6">
          {/* Active Promotions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <span>Promotions Actives</span>
                <Badge className="bg-emerald-100 text-emerald-700">
                  {promotions.filter((p) => p.active).length} actives
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-100">
                    <TableHead>Promotion</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow
                      key={promotion.id}
                      className="border-emerald-50 hover:bg-emerald-25"
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {promotion.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {promotion.minAmount.toLocaleString()} FCFA
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-700 font-mono">
                          {promotion.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          {promotion.type === "percentage"
                            ? "Pourcentage"
                            : "Montant fixe"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-emerald-600">
                          {promotion.type === "percentage"
                            ? `${promotion.value}%`
                            : `${promotion.value.toLocaleString()} FCFA`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(promotion.startDate).toLocaleDateString(
                              "fr-FR",
                            )}
                          </div>
                          <div className="text-gray-500">
                            au{" "}
                            {new Date(promotion.endDate).toLocaleDateString(
                              "fr-FR",
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-purple-200 text-purple-700"
                        >
                          {promotion.usageCount} fois
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            promotion.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {promotion.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-600 hover:bg-emerald-50"
                        >
                          <Tag className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SalesModule;
