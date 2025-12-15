import { Router, Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';

const router = Router();

interface CreateVehicleBody {
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  price: number;
  seller: string;
  images?: string[];
  features?: string[];
  condition: 'new' | 'used';
  mileage?: number;
  location: string;
}

// Get all vehicles
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, condition, location, minPrice, maxPrice } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (condition) query.condition = condition;
    if (location) query.location = new RegExp(location as string, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query)
      .populate('seller', 'email name phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: vehicles
    });
  } catch (err: any) {
    console.error('Get vehicles error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Get single vehicle
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('seller', 'email name phoneNumber');

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Véhicule non trouvé'
      });
    }

    res.json({
      status: 'success',
      data: vehicle
    });
  } catch (err: any) {
    console.error('Get vehicle error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Create vehicle
router.post('/', async (req: Request<{}, {}, CreateVehicleBody>, res: Response) => {
  try {
    const { title, description, make, model, year, price, seller, images, features, condition, mileage, location } = req.body;

    if (!title || !description || !make || !model || !year || !price || !seller || !condition || !location) {
      return res.status(400).json({
        status: 'error',
        message: 'Champs requis manquants'
      });
    }

    const vehicle = new Vehicle({
      title,
      description,
      make,
      model,
      year,
      price,
      seller,
      images: images || [],
      features: features || [],
      condition,
      mileage,
      location,
      status: 'available'
    });

    await vehicle.save();
    await vehicle.populate('seller', 'email name phoneNumber');

    res.status(201).json({
      status: 'success',
      message: 'Véhicule créé avec succès',
      data: vehicle
    });
  } catch (err: any) {
    console.error('Create vehicle error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Update vehicle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'email name phoneNumber');

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Véhicule non trouvé'
      });
    }

    res.json({
      status: 'success',
      message: 'Véhicule mis à jour',
      data: vehicle
    });
  } catch (err: any) {
    console.error('Update vehicle error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Delete vehicle
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Véhicule non trouvé'
      });
    }

    res.json({
      status: 'success',
      message: 'Véhicule supprimé'
    });
  } catch (err: any) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

export default router;
