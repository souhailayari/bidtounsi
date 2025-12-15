# 📊 Guide MongoDB - Vérifier Comptes et Données

## 1️⃣ Démarrer MongoDB

### Option A: MongoDB Service (Windows)
```powershell
# Vérifier si MongoDB tourne
Get-Service -Name MongoDB
# Démarrer MongoDB
Start-Service MongoDB
# Arrêter MongoDB
Stop-Service MongoDB
```

### Option B: MongoDB Standalone
```powershell
# Démarrer MongoDB en ligne de commande
mongod --dbpath "C:\data\db"
```

### Option C: Docker
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 2️⃣ Se Connecter à MongoDB

### Avec MongoDB Shell (mongosh)
```powershell
# Démarrer MongoDB Shell
mongosh
# ou
mongo
```

### Se Connecter à la Base de Données
```javascript
// Dans le shell MongoDB
use bidtounsi    // Utiliser la base bidtounsi
```

---

## 3️⃣ Vérifier les Comptes Utilisateurs

### Lister TOUS les Utilisateurs
```javascript
// Dans mongosh
db.users.find()
```

**Résultat:**
```javascript
[
  {
    _id: ObjectId("..."),
    email: "seller@example.com",
    password: "$2b$10$...", // Hash bcryptjs
    name: "Seller Name",
    role: "vendeur",
    phoneNumber: "+216 95 123 456",
    createdAt: ISODate("2025-11-15T10:00:00.000Z")
  },
  {
    _id: ObjectId("..."),
    email: "buyer@example.com",
    password: "$2b$10$...",
    name: "Buyer Name",
    role: "acheteur",
    phoneNumber: "+216 95 654 321",
    createdAt: ISODate("2025-11-15T10:05:00.000Z")
  }
]
```

### Chercher UN Utilisateur Spécifique
```javascript
// Par email
db.users.findOne({ email: "seller@example.com" })

// Par ID
db.users.findOne({ _id: ObjectId("607f1f77bcf86cd799439011") })

// Par rôle
db.users.find({ role: "vendeur" })

// Par rôle + compter
db.users.countDocuments({ role: "vendeur" })
```

### Afficher Formaté (Pretty)
```javascript
db.users.find().pretty()
```

### Voir Juste les Emails et Noms
```javascript
db.users.find({}, { email: 1, name: 1, role: 1, _id: 0 })
```

---

## 4️⃣ Vérifier les Véhicules (Annonces)

### Lister TOUS les Véhicules
```javascript
db.vehicles.find()
```

### Chercher par Vendeur
```javascript
// Trouver véhicules du vendeur avec ID
db.vehicles.find({ seller: ObjectId("607f1f77bcf86cd799439011") })

// Avec infos du vendeur (population)
db.vehicles.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "seller",
      foreignField: "_id",
      as: "sellerInfo"
    }
  },
  { $unwind: "$sellerInfo" },
  { $project: { title: 1, price: 1, "sellerInfo.email": 1 } }
])
```

### Filtrer les Véhicules
```javascript
// Véhicules disponibles
db.vehicles.find({ status: "available" })

// Véhicules par condition
db.vehicles.find({ condition: "used" })

// Véhicules par prix (5000-20000)
db.vehicles.find({ price: { $gte: 5000, $lte: 20000 } })

// Véhicules par marque
db.vehicles.find({ make: "Toyota" })
```

### Compter les Véhicules
```javascript
db.vehicles.countDocuments()              // Total
db.vehicles.countDocuments({ status: "available" })  // Disponibles
db.vehicles.countDocuments({ make: "Peugeot" })      // Par marque
```

---

## 5️⃣ Statistiques et Agrégations

### Nombre Total de Comptes par Rôle
```javascript
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

**Résultat:**
```javascript
[
  { _id: "acheteur", count: 5 },
  { _id: "vendeur", count: 3 },
  { _id: "admin", count: 1 }
]
```

### Utilisateurs créés par jour
```javascript
db.users.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
])
```

### Statistiques Véhicules par Marque
```javascript
db.vehicles.aggregate([
  { $group: { _id: "$make", count: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
  { $sort: { count: -1 } }
])
```

**Résultat:**
```javascript
[
  { _id: "Toyota", count: 5, avgPrice: 15000 },
  { _id: "Peugeot", count: 3, avgPrice: 12000 }
]
```

### Prix Moyen par Condition
```javascript
db.vehicles.aggregate([
  {
    $group: {
      _id: "$condition",
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
      count: { $sum: 1 }
    }
  }
])
```

---

## 6️⃣ Modifier les Données

### Changer le Rôle d'un Utilisateur
```javascript
db.users.updateOne(
  { email: "seller@example.com" },
  { $set: { role: "admin" } }
)
```

### Supprimer un Utilisateur
```javascript
db.users.deleteOne({ email: "seller@example.com" })
```

### Supprimer Tous les Véhicules d'un Vendeur
```javascript
db.vehicles.deleteMany({ 
  seller: ObjectId("607f1f77bcf86cd799439011") 
})
```

### Mettre à Jour un Véhicule
```javascript
db.vehicles.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "sold", price: 15000 } }
)
```

---

## 7️⃣ Commandes Utiles

### Statistiques Générales de la Base
```javascript
db.stats()
```

### Voir les Collections
```javascript
show collections
```

### Compter Tous les Documents
```javascript
db.users.estimatedDocumentCount()
db.vehicles.estimatedDocumentCount()
```

### Voir la Taille de la Base
```javascript
db.users.dataSize()
db.vehicles.dataSize()
```

### Supprimer une Collection
```javascript
db.users.drop()    // ⚠️ Supprime tous les utilisateurs
```

### Vider une Collection (Supprimer tous les docs)
```javascript
db.users.deleteMany({})
db.vehicles.deleteMany({})
```

---

## 8️⃣ Requêtes Avancées

### Recherche Textuelle
```javascript
// Chercher dans le titre des véhicules
db.vehicles.find({ $text: { $search: "Toyota Corolla" } })
```

### Utiliser des Regex
```javascript
// Emails contenant "gmail"
db.users.find({ email: { $regex: "gmail", $options: "i" } })

// Noms commençant par "Ali"
db.users.find({ name: { $regex: "^Ali", $options: "i" } })
```

### Tri et Limite
```javascript
// Les 5 véhicules les plus chers
db.vehicles.find().sort({ price: -1 }).limit(5)

// Les 10 utilisateurs les plus récents
db.users.find().sort({ createdAt: -1 }).limit(10)
```

### Passer des Données
```javascript
// Passer les 5 premiers
db.vehicles.find().skip(5).limit(10)
```

---

## 9️⃣ Exportation des Données

### Exporter en JSON
```powershell
# Depuis PowerShell
mongoexport --db bidtounsi --collection users --out users.json --pretty
mongoexport --db bidtounsi --collection vehicles --out vehicles.json --pretty
```

### Importer depuis JSON
```powershell
mongoimport --db bidtounsi --collection users --file users.json
```

---

## 🔟 Format des Données en Base

### Structure Utilisateur (User)
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcryptjs hash),
  name: String,
  role: "admin" | "vendeur" | "acheteur",
  phoneNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Structure Véhicule (Vehicle)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  make: String (Toyota, Peugeot, etc.),
  model: String,
  year: Number,
  price: Number,
  seller: ObjectId (ref to users),
  images: [String],
  features: [String],
  condition: "new" | "used",
  mileage: Number,
  location: String,
  status: "available" | "pending" | "sold",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Exemples Pratiques

### Cas 1: Un vendeur a publié 3 annonces, je veux les voir
```javascript
// 1. Trouver l'ID du vendeur
const seller = db.users.findOne({ email: "seller@example.com" })

// 2. Voir ses annonces
db.vehicles.find({ seller: seller._id }).pretty()
```

### Cas 2: Combien de vendeurs ont des véhicules disponibles?
```javascript
db.vehicles.aggregate([
  { $match: { status: "available" } },
  { $group: { _id: "$seller" } },
  { $group: { _id: null, count: { $sum: 1 } } }
])
```

### Cas 3: Quel est le prix moyen des Toyota?
```javascript
db.vehicles.aggregate([
  { $match: { make: "Toyota" } },
  { $group: { _id: null, avgPrice: { $avg: "$price" } } }
])
```

### Cas 4: Voir les 5 annonces les plus chères
```javascript
db.vehicles.find()
  .sort({ price: -1 })
  .limit(5)
  .project({ title: 1, price: 1, make: 1, model: 1 })
```

### Cas 5: Tous les comptes avec les infos du vendeur
```javascript
db.users.aggregate([
  { $match: { role: "vendeur" } },
  {
    $lookup: {
      from: "vehicles",
      localField: "_id",
      foreignField: "seller",
      as: "annonces"
    }
  },
  {
    $project: {
      email: 1,
      name: 1,
      "annonces.title": 1,
      "annonces.price": 1
    }
  }
])
```

---

## ⚠️ Conseils de Sécurité

- ❌ Ne jamais supprimer les données de production
- ✅ Faire des backups réguliers
- ✅ Utiliser des indexes sur les champs fréquemment recherchés
- ✅ Valider les données avant insertion
- ✅ Les passwords sont hashs (ne jamais les voir en clair)

---

**Besoin d'aide pour une requête spécifique? 🔍**
