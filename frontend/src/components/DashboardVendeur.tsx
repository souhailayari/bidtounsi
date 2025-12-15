import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { fetchVehicles } from '../utils/api';
import { Vehicle, Bid } from '../types';
import { Plus, Car, Euro, Calendar, Users } from 'lucide-react';

interface DashboardVendeurProps {
  onNavigate: (page: string) => void;
}

export function DashboardVendeur({ onNavigate }: DashboardVendeurProps) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = await fetchVehicles();
      const userVehicles = all.filter((v: Vehicle) => v.sellerId === user?.id);
      setVehicles(userVehicles);

      const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
  const userBids = allBids.filter((b: Bid) => userVehicles.some((v: Vehicle) => v.id === b.vehicleId));
      setBids(userBids);
    };
    load();
  }, [user?.id]);

  const getVehicleStats = () => {
    const active = vehicles.filter(v => v.status === 'active').length;
    const sold = vehicles.filter(v => v.status === 'sold').length;
    const totalBids = bids.length;
    
    return { active, sold, totalBids, total: vehicles.length };
  };

  const stats = getVehicleStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'ended':
        return <Badge variant="outline">Terminé</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800">Vendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord Vendeur
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.companyName}
          </p>
        </div>
        <Button onClick={() => onNavigate('publish-vehicle')} className="bg-secondary hover:bg-secondary/90">
          <Plus className="w-4 h-4 mr-2" />
          Publier une annonce
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total véhicules</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Annonces actives</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendus</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offres reçues</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalBids}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des véhicules */}
      <Card>
        <CardHeader>
          <CardTitle>Mes annonces</CardTitle>
          <CardDescription>
            Gérez vos véhicules en vente et suivez les offres reçues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune annonce publiée</p>
              <Button onClick={() => onNavigate('publish-vehicle')} variant="outline">
                Publier votre première annonce
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => {
                const vehicleBids = bids.filter(b => b.vehicleId === vehicle.id);
                const highestBid = vehicleBids.reduce((max, bid) => 
                  bid.amount > max ? bid.amount : max, vehicle.startingPrice
                );
                const daysRemaining = getDaysRemaining(vehicle.endDate);

                return (
                  <div key={vehicle.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{vehicle.title}</h3>
                          {getStatusBadge(vehicle.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Type: {vehicle.vehicleType} • Prix de départ: {formatPrice(vehicle.startingPrice)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Offre actuelle: {formatPrice(highestBid)}</span>
                          <span>{vehicleBids.length} offre(s)</span>
                          {vehicle.status === 'active' && (
                            <span className={daysRemaining <= 3 ? 'text-red-600' : ''}>
                              {daysRemaining} jour(s) restant(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Voir les offres
                        </Button>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}