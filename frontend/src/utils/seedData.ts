import { User, Vehicle, Bid } from '../types';

// Fonction pour initialiser les données de démonstration
export function initializeSeedData() {
  // Vérifier si les données existent déjà
  const existingUsers = localStorage.getItem('bidtounsi_users');
  
  if (!existingUsers) {
    // Créer des utilisateurs de démonstration
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'admin@bidtounsi.com',
        password: 'admin123',
        companyName: 'BidTounsi Administration',
        phone: '01 00 00 00 00',
        userType: 'admin',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        email: 'vendeur@demo.com',
        password: 'password123',
        companyName: 'AutoFleet Solutions',
        phone: '01 23 45 67 89',
        userType: 'vendeur',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: '3',
        email: 'acheteur@demo.com',
        password: 'password123',
        companyName: 'Garage Central',
        phone: '01 98 76 54 32',
        userType: 'acheteur',
        createdAt: '2025-01-01T00:00:00.000Z'
      },
      {
        id: '4',
        email: 'acheteur2@demo.com',
        password: 'password123',
        companyName: 'Motors & Co',
        phone: '01 11 22 33 44',
        userType: 'acheteur',
        createdAt: '2025-01-02T00:00:00.000Z'
      }
    ];

    localStorage.setItem('bidtounsi_users', JSON.stringify(demoUsers));

    // Créer des véhicules de démonstration
    const demoVehicles: Vehicle[] = [
      {
        id: '1',
        title: 'Peugeot 3008 HDI 130 - 2019',
        description: 'Véhicule de société en excellent état. 45 000 km. Entretien régulier. Climatisation, GPS, radar de recul. Contrôle technique OK.',
        vehicleType: 'voiture',
        startingPrice: 18000,
        currentHighestBid: 19500,
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'
        ],
        sellerId: '2',
        sellerName: 'AutoFleet Solutions',
        status: 'active',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours
        createdAt: '2025-10-01T00:00:00.000Z'
      },
      {
        id: '2',
        title: 'Renault Master L2H2 - 2020',
        description: 'Utilitaire professionnel, 25 000 km. Parfait pour livraisons. Crochet d\'attelage, barres de toit incluses.',
        vehicleType: 'utilitaire',
        startingPrice: 22000,
        currentHighestBid: 23500,
        images: [
          'https://images.unsplash.com/photo-1586941961054-5d41e0b04d1a?w=400'
        ],
        sellerId: '2',
        sellerName: 'AutoFleet Solutions',
        status: 'active',
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 jours
        createdAt: '2025-09-28T00:00:00.000Z'
      },
      {
        id: '3',
        title: 'BMW Série 5 520d - 2018',
        description: 'Berline executive, 78 000 km. Cuir, navigation professional, sièges chauffants. Historique complet.',
        vehicleType: 'voiture',
        startingPrice: 25000,
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'
        ],
        sellerId: '2',
        sellerName: 'AutoFleet Solutions',
        status: 'active',
        endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 jours
        createdAt: '2025-09-25T00:00:00.000Z'
      }
    ];

    localStorage.setItem('bidtounsi_vehicles', JSON.stringify(demoVehicles));

    // Créer des offres de démonstration
    const demoBids: Bid[] = [
      {
        id: '1',
        vehicleId: '1',
        bidderId: '3',
        bidderName: 'Garage Central',
        amount: 19500,
        timestamp: '2025-10-02T10:30:00.000Z',
        status: 'pending'
      },
      {
        id: '2',
        vehicleId: '2',
        bidderId: '3',
        bidderName: 'Garage Central',
        amount: 23000,
        timestamp: '2024-10-01T14:20:00.000Z',
        status: 'pending'
      },
      {
        id: '3',
        vehicleId: '2',
        bidderId: '4',
        bidderName: 'Motors & Co',
        amount: 23500,
        timestamp: '2024-10-02T09:15:00.000Z',
        status: 'pending'
      }
    ];

    localStorage.setItem('bidtounsi_bids', JSON.stringify(demoBids));

    console.log('Données de démonstration initialisées');
  }
}