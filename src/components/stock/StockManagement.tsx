"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  supplier: string;
  lastRestocked: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  practitioner: string;
}

const StockManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  // Sample data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Crème Hydratante Visage",
      category: "Soins Visage",
      price: 15000,
      stock: 25,
      minStock: 10,
      description: "Crème hydratante pour tous types de peau",
      supplier: "Beauty Supply Cameroun",
      lastRestocked: "2024-01-15",
    },
    {
      id: "2",
      name: "Vernis à Ongles Rouge",
      category: "Manucure",
      price: 3500,
      stock: 5,
      minStock: 15,
      description: "Vernis longue tenue couleur rouge passion",
      supplier: "Nail Art Pro",
      lastRestocked: "2024-01-10",
    },
    {
      id: "3",
      name: "Masque Purifiant",
      category: "Soins Visage",
      price: 8000,
      stock: 18,
      minStock: 8,
      description: "Masque à l'argile pour peaux grasses",
      supplier: "Natural Beauty",
      lastRestocked: "2024-01-20",
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Soin Visage Complet",
      category: "Soins Visage",
      price: 25000,
      duration: 60,
      description: "Nettoyage, gommage, masque et hydratation",
      practitioner: "Marie Dubois",
    },
    {
      id: "2",
      name: "Manucure Française",
      category: "Manucure",
      price: 12000,
      duration: 45,
      description: "Manucure classique avec vernis français",
      practitioner: "Sophie Martin",
    },
    {
      id: "3",
      name: "Épilation Sourcils",
      category: "Épilation",
      price: 5000,
      duration: 20,
      description: "Épilation et restructuration des sourcils",
      practitioner: "Claire Nguyen",
    },
  ]);

  const categories = ["all", "Soins Visage", "Manucure", "Épilation", "Corps"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock,
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return { status: "Faible", color: "bg-red-100 text-red-800" };
    } else if (stock <= minStock * 1.5) {
      return { status: "Moyen", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "Bon", color: "bg-green-100 text-green-800" };
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">Total Produits</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-pink-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Services</p>
                <p className="text-3xl font-bold">{services.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Stock Faible</p>
                <p className="text-3xl font-bold">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Valeur Stock</p>
                <p className="text-3xl font-bold">
                  {formatPrice(
                    products.reduce(
                      (total, product) => total + product.price * product.stock,
                      0,
                    ),
                  )}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alerte Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-white rounded"
                >
                  <span className="font-medium">{product.name}</span>
                  <Badge variant="destructive">
                    {product.stock} restant(s)
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter Produit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un Produit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Nom du produit</Label>
                    <Input id="productName" placeholder="Nom du produit" />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productPrice">Prix (FCFA)</Label>
                      <Input id="productPrice" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock</Label>
                      <Input id="productStock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Description du produit"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                    Ajouter le Produit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serviceName">Nom du service</Label>
                    <Input id="serviceName" placeholder="Nom du service" />
                  </div>
                  <div>
                    <Label htmlFor="serviceCategory">Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servicePrice">Prix (FCFA)</Label>
                      <Input id="servicePrice" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="serviceDuration">Durée (min)</Label>
                      <Input
                        id="serviceDuration"
                        type="number"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="serviceDescription">Description</Label>
                    <Textarea
                      id="serviceDescription"
                      placeholder="Description du service"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                    Ajouter le Service
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(
                product.stock,
                product.minStock,
              );
              return (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-pink-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Fournisseur: {product.supplier}</span>
                        <span>MAJ: {product.lastRestocked}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {service.category}
                      </p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {service.duration} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span>Praticien: {service.practitioner}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagement;
