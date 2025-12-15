import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { fetchVehicles } from '../utils/api';
import { MarketReportExport } from './MarketReportExport';
import { User, Vehicle, Bid, UserType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Users, Car, Gavel, Plus, Trash2, Eye, FileText } from 'lucide-react';

interface DashboardAdminProps {
  onNavigate: (page: string) => void;
}

export function DashboardAdmin({ onNavigate }: DashboardAdminProps) {
  const { createUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    companyName: '',
    email: '',
    phone: '',
    userType: '' as UserType
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    loadVehiclesFromApi();
  }, []);

  const loadData = () => {
    // Charger les utilisateurs
    const allUsers = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    setUsers(allUsers.filter((u: User) => u.userType !== 'admin'));

    // Charger les véhicules
    const allVehicles = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]');
    setVehicles(allVehicles);

    // Charger les offres
    const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
    setBids(allBids);
  };

  const loadVehiclesFromApi = async () => {
    const vs = await fetchVehicles();
    setVehicles(vs);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUser.userType) {
      setError('Veuillez sélectionner un type de compte');
      return;
    }

    const success = await createUser({
      companyName: newUser.companyName,
      email: newUser.email,
      phone: newUser.phone,
      userType: newUser.userType as Exclude<UserType, 'admin'>,
      password: 'motdepasse123' // Mot de passe par défaut
    });

    if (success) {
      setIsCreateUserOpen(false);
      setNewUser({ companyName: '', email: '', phone: '', userType: '' as UserType });
      loadData();
      alert(`Compte créé avec succès ! Mot de passe par défaut: motdepasse123`);
    } else {
      setError('Cet email existe déjà');
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      const allUsers = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
      const updatedUsers = allUsers.filter((u: User) => u.id !== userId);
      localStorage.setItem('bidtounsi_users', JSON.stringify(updatedUsers));
      loadData();
    }
  };

  const deleteVehicle = (vehicleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      const allVehicles = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]');
      const updatedVehicles = allVehicles.filter((v: Vehicle) => v.id !== vehicleId);
      localStorage.setItem('bidtounsi_vehicles', JSON.stringify(updatedVehicles));
      
      // Supprimer aussi les offres associées
      const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
      const updatedBids = allBids.filter((b: Bid) => b.vehicleId !== vehicleId);
      localStorage.setItem('bidtounsi_bids', JSON.stringify(updatedBids));
      
      loadData();
    }
  };

  const deleteBid = (bidId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette enchère ?')) {
      const allBids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
      const updatedBids = allBids.filter((b: Bid) => b.id !== bidId);
      localStorage.setItem('bidtounsi_bids', JSON.stringify(updatedBids));
      loadData();
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const vendeurs = users.filter(u => u.userType === 'vendeur').length;
    const acheteurs = users.filter(u => u.userType === 'acheteur').length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
    const totalBids = bids.length;

    return { totalUsers, vendeurs, acheteurs, activeVehicles, soldVehicles, totalBids };
  };

  const stats = getStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

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

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'vendeur':
        return <Badge className="bg-blue-100 text-blue-800">Vendeur</Badge>;
      case 'acheteur':
        return <Badge className="bg-green-100 text-green-800">Acheteur</Badge>;
      default:
        return <Badge variant="secondary">{userType}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600">
            Gestion de la plateforme BidTounsi
          </p>
        </div>
        
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              Créer un compte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau compte</DialogTitle>
              <DialogDescription>
                Créer un compte vendeur ou acheteur pour la plateforme
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={newUser.companyName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, companyName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userType">Type de compte</Label>
                <Select
                  value={newUser.userType}
                  onValueChange={(value: string) => setNewUser(prev => ({ ...prev, userType: value as UserType }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendeur">Société Vendeur</SelectItem>
                    <SelectItem value="acheteur">Agence Acheteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le compte</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
                <p className="text-xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Vendeurs</p>
                <p className="text-xl font-bold text-blue-600">{stats.vendeurs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Acheteurs</p>
                <p className="text-xl font-bold text-green-600">{stats.acheteurs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Annonces actives</p>
                <p className="text-xl font-bold text-orange-600">{stats.activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Véhicules vendus</p>
                <p className="text-xl font-bold text-purple-600">{stats.soldVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Gavel className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total offres</p>
                <p className="text-xl font-bold text-red-600">{stats.totalBids}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des comptes */}
      {/* Onglets de gestion */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="bids">Enchères</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des comptes utilisateurs</CardTitle>
              <CardDescription>
                Liste de tous les comptes vendeurs et acheteurs
              </CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.profilePhoto} 
                        alt={user.companyName}
                      />
                      <AvatarFallback>
                        {getInitials(user.companyName)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.companyName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des annonces</CardTitle>
              <CardDescription>
                Superviser toutes les annonces de véhicules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Vendeur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Prix départ</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.title}</TableCell>
                      <TableCell>{vehicle.sellerName}</TableCell>
                      <TableCell className="capitalize">{vehicle.vehicleType}</TableCell>
                      <TableCell>{formatPrice(vehicle.startingPrice)}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>{formatDate(vehicle.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteVehicle(vehicle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des enchères</CardTitle>
              <CardDescription>
                Superviser toutes les enchères en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Enchérisseur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        {vehicles.find(v => v.id === bid.vehicleId)?.title || 'Véhicule supprimé'}
                      </TableCell>
                      <TableCell>{bid.bidderName}</TableCell>
                      <TableCell>{formatPrice(bid.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={bid.status === 'pending' ? 'outline' : bid.status === 'accepted' ? 'default' : 'destructive'}>
                          {bid.status === 'pending' ? 'En attente' : bid.status === 'accepted' ? 'Acceptée' : 'Rejetée'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(bid.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteBid(bid.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <MarketReportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}