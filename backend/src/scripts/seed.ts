import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();

    // Vider les collections existantes
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Créer des utilisateurs de test
    const users = await User.create([
      {
        email: 'seller@example.com',
        password: 'Password123!',
        name: 'Ahmed Seller',
        role: 'vendor',
        phoneNumber: '+216 95 123 456',
      },
      {
        email: 'buyer@example.com',
        password: 'Password123!',
        name: 'Fatima Buyer',
        role: 'user',
        phoneNumber: '+216 95 654 321',
      },
      {
        email: 'admin@example.com',
        password: 'Admin123!',
        name: 'Admin User',
        role: 'admin',
        phoneNumber: '+216 95 999 999',
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Créer des véhicules de test
    const vehicles = await Vehicle.create([
      {
        title: 'Toyota Corolla 2020',
        description: 'Belle voiture familiale, bien entretenue, premier propriétaire',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        price: 15000,
        seller: users[0]._id,
        condition: 'used',
        mileage: 45000,
        location: 'Tunis',
        features: ['Climatisation', 'Direction assistée', 'ABS'],
        images: ['https://via.placeholder.com/400x300?text=Toyota+Corolla'],
        status: 'available',
      },
      {
        title: 'Peugeot 308 2019',
        description: 'Sportive et économe, révision récente, 2 propriétaires',
        make: 'Peugeot',
        model: '308',
        year: 2019,
        price: 12000,
        seller: users[0]._id,
        condition: 'used',
        mileage: 65000,
        location: 'Sfax',
        features: ['Toit panoramique', 'Sièges chauffants', 'Système audio Bose'],
        images: ['https://via.placeholder.com/400x300?text=Peugeot+308'],
        status: 'available',
      },
      {
        title: 'Hyundai i10 2021',
        description: 'Petite ville, économique et fiable, garantie constructeur',
        make: 'Hyundai',
        model: 'i10',
        year: 2021,
        price: 8500,
        seller: users[0]._id,
        condition: 'new',
        mileage: 5000,
        location: 'Sousse',
        features: ['Climatisation', 'Réservation sans clé', 'Caméra de recul'],
        images: ['https://via.placeholder.com/400x300?text=Hyundai+i10'],
        status: 'available',
      },
    ]);

    console.log(`✅ Created ${vehicles.length} vehicles`);

    console.log('🎉 Database seeding completed successfully');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();