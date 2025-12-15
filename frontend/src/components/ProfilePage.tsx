import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Vehicle, Bid } from '../types';
import { fetchVehicles } from '../utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { User as UserIcon, Car, TrendingUp, Users, Edit3, Save, X, Eye, EyeOff, Camera, Upload } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // États pour l'édition du profil
  const [editForm, setEditForm] = useState({
    companyName: user?.companyName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || ''
  });

  // États pour le changement de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // États pour les statistiques
  const [stats, setStats] = useState({
    myVehicles: [] as Vehicle[],
    myBids: [] as Bid[],
    totalUsers: 0,
    totalVehicles: 0,
    totalBids: 0
  });

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = () => {
    if (!user) return;
    (async () => {
      const vehicles = await fetchVehicles();
      const bids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
      const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');

      if (user.userType === 'vendeur') {
        const myVehicles = vehicles.filter((v: Vehicle) => v.sellerId === user.id);
        setStats(prev => ({ ...prev, myVehicles }));
      } else if (user.userType === 'acheteur') {
        const myBids = bids.filter((b: Bid) => b.bidderId === user.id);
        setStats(prev => ({ ...prev, myBids }));
      } else if (user.userType === 'admin') {
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          totalVehicles: vehicles.length,
          totalBids: bids.length
        }));
      }
    })();
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validation basique
    if (!editForm.companyName.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    // Valider l'URL de la photo si fournie
    if (editForm.profilePhoto && !isValidImageUrl(editForm.profilePhoto)) {
      toast.error('L\'URL de la photo n\'est pas valide');
      return;
    }

    // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
    const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    const existingUser = users.find((u: User) => u.email === editForm.email && u.id !== user.id);
    
    if (existingUser) {
      toast.error('Cet email est déjà utilisé par un autre utilisateur');
      return;
    }

    // Mettre à jour l'utilisateur via le contexte
    const success = await updateUser(editForm);
    
    if (success) {
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } else {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const isValidImageUrl = (url: string) => {
    // Accepter les data URLs (base64)
    if (url.startsWith('data:image/')) {
      return true;
    }
    
    // Accepter les URLs HTTP/HTTPS valides
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
    } catch {
      return false;
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

  const handleChangePassword = async () => {
    if (!user) return;

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    if (passwordForm.currentPassword !== user.password) {
      toast.error('Mot de passe actuel incorrect');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Mettre à jour le mot de passe via le contexte
    const success = await updateUser({ password: passwordForm.newPassword });
    
    if (success) {
      toast.success('Mot de passe modifié avec succès');
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error('Erreur lors de la modification du mot de passe');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et consultez vos statistiques</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Modifiez vos informations de profil
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo de profil */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={isEditing ? editForm.profilePhoto : user.profilePhoto} 
                      alt={user.companyName}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.companyName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Camera className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="w-full max-w-md space-y-4">
                    <div className="space-y-2">
                      <Label>Choisir une photo</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Vérifier la taille (max 5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('La taille de l\'image ne doit pas dépasser 5MB');
                                return;
                              }
                              
                              // Créer une URL locale pour l'image
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditForm(prev => ({ ...prev, profilePhoto: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Télécharger une photo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Ou
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profilePhoto">URL de la photo de profil</Label>
                      <Input
                        id="profilePhoto"
                        placeholder="https://example.com/photo.jpg"
                        value={editForm.profilePhoto}
                        onChange={(e) => setEditForm(prev => ({ ...prev, profilePhoto: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Utilisez une URL d'image (JPG, PNG, GIF, WebP)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  {isEditing ? (
                    <Input
                      id="companyName"
                      value={editForm.companyName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded">{user.companyName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded">{user.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded">{user.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Type d'utilisateur</Label>
                  <div className="p-2">
                    <Badge variant="secondary" className="capitalize">
                      {user.userType}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Membre depuis</Label>
                <p className="p-2 bg-muted rounded">{formatDate(user.createdAt)}</p>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      companyName: user.companyName,
                      email: user.email,
                      phone: user.phone,
                      profilePhoto: user.profilePhoto || ''
                    });
                  }}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Assurez-vous d'utiliser un mot de passe sécurisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Modifier le mot de passe
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleChangePassword}>
                      <Save className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {user.userType === 'vendeur' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Mes véhicules publiés ({stats.myVehicles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.myVehicles.length === 0 ? (
                  <p className="text-muted-foreground">Aucun véhicule publié</p>
                ) : (
                  <div className="space-y-4">
                    {stats.myVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{vehicle.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.vehicleType} • Publié le {formatDate(vehicle.createdAt)}
                          </p>
                          <p className="text-sm">
                            Prix de départ: {formatPrice(vehicle.startingPrice)}
                            {vehicle.currentHighestBid && (
                              <span className="ml-2 text-green-600">
                                • Enchère actuelle: {formatPrice(vehicle.currentHighestBid)}
                              </span>
                            )}
                          </p>
                        </div>
                        <Badge 
                          variant={vehicle.status === 'active' ? 'default' : vehicle.status === 'sold' ? 'secondary' : 'outline'}
                        >
                          {vehicle.status === 'active' ? 'Actif' : vehicle.status === 'sold' ? 'Vendu' : 'Terminé'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.userType === 'acheteur' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mes enchères ({stats.myBids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.myBids.length === 0 ? (
                  <p className="text-muted-foreground">Aucune enchère placée</p>
                ) : (
                  <div className="space-y-4">
                    {stats.myBids.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Enchère de {formatPrice(bid.amount)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(bid.timestamp)}
                          </p>
                        </div>
                        <Badge 
                          variant={bid.status === 'pending' ? 'outline' : bid.status === 'accepted' ? 'default' : 'destructive'}
                        >
                          {bid.status === 'pending' ? 'En attente' : bid.status === 'accepted' ? 'Acceptée' : 'Rejetée'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.userType === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4" />
                    Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Total d'utilisateurs</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Car className="h-4 w-4" />
                    Véhicules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground">Total de véhicules</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Enchères
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBids}</div>
                  <p className="text-xs text-muted-foreground">Total d'enchères</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}