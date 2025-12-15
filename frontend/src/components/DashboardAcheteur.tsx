import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { Vehicle, Bid } from '../types';
import { Search, Car, Euro, Clock, Filter } from 'lucide-react';

interface DashboardAcheteurProps {
  onNavigate: (page: string) => void;
}

export function DashboardAcheteur({ onNavigate }: DashboardAcheteurProps) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    // Charger tous les véhicules actifs
    const allVehicles = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]');
    const activeVehicles = allVehicles.filter((v: Vehicle) => v.status === 'active');
    setVehicles(activeVehicles);

    // Charger mes offres
    const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
    const userBids = allBids.filter((b: Bid) => b.bidderId === user?.id);
    setMyBids(userBids);
  }, [user?.id]);

  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || vehicle.vehicleType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.startingPrice - b.startingPrice;
        case 'price-high':
          return b.startingPrice - a.startingPrice;
        case 'ending-soon':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getMyBidsStats = () => {
    const pending = myBids.filter(b => b.status === 'pending').length;
    const accepted = myBids.filter(b => b.status === 'accepted').length;
    const rejected = myBids.filter(b => b.status === 'rejected').length;
    
    return { pending, accepted, rejected, total: myBids.length };
  };

  const stats = getMyBidsStats();

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

  const hasUserBid = (vehicleId: string) => {
    return myBids.some(bid => bid.vehicleId === vehicleId);
  };

  const getUserBidAmount = (vehicleId: string) => {
    const bid = myBids.find(bid => bid.vehicleId === vehicleId);
    return bid ? bid.amount : 0;
  };

  const placeBid = (vehicleId: string) => {
    const amount = prompt('Montant de votre offre (€):');
    if (amount && !isNaN(Number(amount))) {
      const bidAmount = Number(amount);
      const vehicle = vehicles.find(v => v.id === vehicleId);
      
      if (vehicle && bidAmount > vehicle.startingPrice) {
        const newBid: Bid = {
          id: Date.now().toString(),
          vehicleId,
          bidderId: user!.id,
          bidderName: user!.companyName,
          amount: bidAmount,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };

        const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
        allBids.push(newBid);
        localStorage.setItem('bidtounsi_bids', JSON.stringify(allBids));
        
        setMyBids(prev => [...prev, newBid]);
        alert('Votre offre a été soumise avec succès !');
      } else {
        alert('Le montant doit être supérieur au prix de départ');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Acheteur
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user?.companyName}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total offres</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Véhicules disponibles</CardTitle>
          <CardDescription>
            Découvrez les véhicules en vente et faites vos offres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un véhicule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type de véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="voiture">Voiture</SelectItem>
                <SelectItem value="utilitaire">Utilitaire</SelectItem>
                <SelectItem value="camion">Camion</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="ending-soon">Fin prochaine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun véhicule trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => {
                const daysRemaining = getDaysRemaining(vehicle.endDate);
                const userHasBid = hasUserBid(vehicle.id);
                const userBidAmount = getUserBidAmount(vehicle.id);

                return (
                  <div key={vehicle.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{vehicle.title}</h3>
                          <Badge variant="outline">{vehicle.vehicleType}</Badge>
                          {daysRemaining <= 3 && (
                            <Badge className="bg-red-100 text-red-800">
                              Fin proche
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {vehicle.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Prix de départ: {formatPrice(vehicle.startingPrice)}</span>
                          <span>Vendeur: {vehicle.sellerName}</span>
                          <span className={daysRemaining <= 3 ? 'text-red-600' : ''}>
                            {daysRemaining} jour(s) restant(s)
                          </span>
                        </div>
                        {userHasBid && (
                          <div className="mt-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              Votre offre: {formatPrice(userBidAmount)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => placeBid(vehicle.id)}
                          disabled={userHasBid}
                        >
                          {userHasBid ? 'Offre soumise' : 'Faire une offre'}
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