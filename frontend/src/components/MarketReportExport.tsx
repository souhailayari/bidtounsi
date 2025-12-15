import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Vehicle, Bid, User } from '../types';
import { FileText, Download, TrendingUp, Car, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MarketReportExport() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMarketReport = async () => {
    setIsGenerating(true);
    
    try {
      // Récupérer toutes les données
      const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]') as User[];
      const vehicles = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]') as Vehicle[];
      const bids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]') as Bid[];

      // Calculer les statistiques
      const stats = calculateMarketStats(users, vehicles, bids);
      
      // Générer le PDF
      await generatePDF(stats, vehicles, bids);
      
      toast.success('Rapport de marché généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateMarketStats = (users: User[], vehicles: Vehicle[], bids: Bid[]) => {
    const totalUsers = users.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
    const totalBids = bids.length;
    
    // Valeur moyenne des véhicules
    const avgVehiclePrice = vehicles.length > 0 
      ? vehicles.reduce((sum, v) => sum + v.startingPrice, 0) / vehicles.length 
      : 0;
    
    // Valeur moyenne des enchères
    const avgBidAmount = bids.length > 0 
      ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length 
      : 0;
    
    // Top vendeurs
    const sellerStats = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.sellerId] = (acc[vehicle.sellerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Top acheteurs (par nombre d'enchères)
    const bidderStats = bids.reduce((acc, bid) => {
      acc[bid.bidderId] = (acc[bid.bidderId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Répartition par type de véhicule
    const vehicleTypeStats = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Activité par mois
    const monthlyActivity = vehicles.reduce((acc, vehicle) => {
      const month = new Date(vehicle.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      activeVehicles,
      soldVehicles,
      totalBids,
      avgVehiclePrice,
      avgBidAmount,
      sellerStats,
      bidderStats,
      vehicleTypeStats,
      monthlyActivity
    };
  };

  const generatePDF = async (stats: any, vehicles: Vehicle[], bids: Bid[]) => {
    // Créer le contenu HTML pour le PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Rapport de Marché BidTounsi</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #1D4ED8; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .logo { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1D4ED8; 
            margin-bottom: 10px; 
          }
          .subtitle { 
            color: #666; 
            font-size: 16px; 
          }
          .section { 
            margin-bottom: 30px; 
          }
          .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #1D4ED8; 
            border-bottom: 2px solid #f0f0f0; 
            padding-bottom: 10px; 
            margin-bottom: 15px; 
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 20px; 
          }
          .stat-card { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            border-left: 4px solid #1D4ED8; 
          }
          .stat-number { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1D4ED8; 
          }
          .stat-label { 
            color: #666; 
            font-size: 14px; 
            margin-top: 5px; 
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
          }
          .table th, .table td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
          }
          .table th { 
            background-color: #f8f9fa; 
            font-weight: bold; 
            color: #1D4ED8; 
          }
          .table tr:hover { 
            background-color: #f5f5f5; 
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            color: #666; 
            font-size: 12px; 
          }
          .currency { 
            color: #10B981; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">BidTounsi</div>
          <div class="subtitle">Rapport de Marché - ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>

        <div class="section">
          <h2 class="section-title">📊 Vue d'ensemble du marché</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.totalUsers}</div>
              <div class="stat-label">Utilisateurs actifs</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.activeVehicles}</div>
              <div class="stat-label">Véhicules en vente</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.soldVehicles}</div>
              <div class="stat-label">Véhicules vendus</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.totalBids}</div>
              <div class="stat-label">Enchères placées</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">💰 Analyse des prix</h2>
          <p><strong>Prix moyen des véhicules:</strong> <span class="currency">${new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(stats.avgVehiclePrice)}</span></p>
          <p><strong>Montant moyen des enchères:</strong> <span class="currency">${new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(stats.avgBidAmount)}</span></p>
        </div>

        <div class="section">
          <h2 class="section-title">🚗 Répartition par type de véhicule</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Type de véhicule</th>
                <th>Nombre</th>
                <th>Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(stats.vehicleTypeStats).map(([type, count]) => `
                <tr>
                  <td>${type}</td>
                  <td>${count}</td>
                  <td>${((count as number / vehicles.length) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">📈 Activité récente</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Prix de départ</th>
                <th>Enchère actuelle</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${vehicles.slice(0, 10).map(vehicle => `
                <tr>
                  <td>${vehicle.title}</td>
                  <td class="currency">${new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(vehicle.startingPrice)}</td>
                  <td class="currency">${vehicle.currentHighestBid ? new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(vehicle.currentHighestBid) : '-'}</td>
                  <td>${vehicle.status === 'active' ? 'Actif' : vehicle.status === 'sold' ? 'Vendu' : 'Terminé'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Rapport généré par BidTounsi - Plateforme de vente aux enchères de véhicules</p>
          <p>© 2025 BidTounsi. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `;

    // Créer et télécharger le fichier HTML (qui peut être imprimé en PDF)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BidTounsi_Rapport_Marche_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  // Affichage des statistiques en temps réel
  const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]') as User[];
  const vehicles = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]') as Vehicle[];
  const bids = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]') as Bid[];
  
  const liveStats = {
    totalUsers: users.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    soldVehicles: vehicles.filter(v => v.status === 'sold').length,
    totalBids: bids.length,
    totalRevenue: vehicles
      .filter(v => v.currentHighestBid)
      .reduce((sum, v) => sum + (v.currentHighestBid || 0), 0)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rapport de Marché
        </CardTitle>
        <CardDescription>
          Générez un rapport détaillé de l'activité du marché pour analyser les tendances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold">{liveStats.totalUsers}</div>
            <div className="text-xs text-muted-foreground">Utilisateurs</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
              <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xl font-bold">{liveStats.activeVehicles}</div>
            <div className="text-xs text-muted-foreground">Véhicules actifs</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xl font-bold">{liveStats.soldVehicles}</div>
            <div className="text-xs text-muted-foreground">Vendus</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-xl font-bold">{liveStats.totalBids}</div>
            <div className="text-xs text-muted-foreground">Enchères</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-2">
              <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-lg font-bold">{formatPrice(liveStats.totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">Revenus</div>
          </div>
        </div>

        <Separator />

        {/* Tendances récentes */}
        <div>
          <h4 className="font-medium mb-3">Activité récente</h4>
          <div className="space-y-2">
            {vehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{vehicle.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {vehicle.vehicleType} • {new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(vehicle.startingPrice)}</p>
                  <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {vehicle.status === 'active' ? 'Actif' : vehicle.status === 'sold' ? 'Vendu' : 'Terminé'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bouton d'export */}
        <div className="text-center">
          <Button 
            onClick={generateMarketReport} 
            disabled={isGenerating}
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Génération en cours...' : 'Générer le rapport complet'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Le rapport sera téléchargé au format HTML (imprimable en PDF)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}