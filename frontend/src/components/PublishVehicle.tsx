import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { createVehicle } from '../utils/api';
import { Vehicle } from '../types';
import { ArrowLeft, Upload, X } from 'lucide-react';

interface PublishVehicleProps {
  onNavigate: (page: string) => void;
}

export function PublishVehicle({ onNavigate }: PublishVehicleProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleType: '' as 'voiture' | 'utilitaire' | 'camion' | '',
    startingPrice: '',
    duration: '30',
  });
  const [hasStartingPrice, setHasStartingPrice] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simuler l'upload d'images (dans un vrai projet, on utiliserait un service de stockage)
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 20)); // Max 20 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.vehicleType) {
      setError('Veuillez sélectionner un type de véhicule');
      return;
    }

    if (hasStartingPrice && (!formData.startingPrice || isNaN(Number(formData.startingPrice)))) {
      setError('Veuillez entrer un prix de départ valide');
      return;
    }

    if (images.length === 0) {
      setError('Veuillez ajouter au moins une image');
      return;
    }

    setLoading(true);

    // Créer l'annonce
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      vehicleType: formData.vehicleType,
      startingPrice: hasStartingPrice ? Number(formData.startingPrice) : 0,
      images,
      sellerId: user!.id,
      sellerName: user!.companyName,
      status: 'active',
      endDate: new Date(Date.now() + Number(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder dans localStorage
    try {
      await createVehicle(newVehicle);
    } catch (e) {
      // createVehicle already falls back to localStorage
    }

    setLoading(false);
    alert('Votre annonce a été publiée avec succès !');
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Publier une annonce
          </h1>
          <p className="text-gray-600">
            Ajoutez votre véhicule à la plateforme d'enchères
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du véhicule</CardTitle>
          <CardDescription>
            Remplissez tous les détails pour attirer les acheteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Peugeot 3008 HDI 130 - 2019"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Type de véhicule *</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value: string) => handleInputChange('vehicleType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voiture">Voiture</SelectItem>
                    <SelectItem value="utilitaire">Utilitaire</SelectItem>
                    <SelectItem value="camion">Camion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée de l'enchère (jours) *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value: string) => handleInputChange('duration', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                    <SelectItem value="21">21 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Case à cocher pour le prix de départ */}
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                id="hasStartingPrice"
                checked={hasStartingPrice}
                onCheckedChange={(checked: boolean | 'indeterminate' | undefined) => {
                  const isChecked = checked === true;
                  setHasStartingPrice(isChecked);
                  if (!isChecked) {
                    handleInputChange('startingPrice', '');
                  }
                }}
              />
              <Label
                htmlFor="hasStartingPrice"
                className="text-sm cursor-pointer"
              >
                Définir un prix de départ pour l'enchère
              </Label>
            </div>

            {/* Champ prix de départ conditionnel */}
            {hasStartingPrice && (
              <div className="space-y-2">
                <Label htmlFor="startingPrice">Prix de départ (€) *</Label>
                <Input
                  id="startingPrice"
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                  placeholder="15000"
                  min="0"
                  step="100"
                  required
                />
                <p className="text-sm text-gray-500">
                  Le prix de départ sera le montant minimum pour les enchères
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description complète *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez en détail le véhicule : année, kilométrage, état, équipements, historique d'entretien..."
                rows={6}
                required
              />
            </div>

            {/* Upload d'images */}
            <div className="space-y-4">
              <Label>Images du véhicule * (max 20)</Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Cliquez pour ajouter des images ou glissez-déposez
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Sélectionner des images
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Véhicule ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('dashboard')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
                {loading ? 'Publication...' : 'Publier l\'annonce'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
