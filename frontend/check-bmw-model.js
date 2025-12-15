#!/usr/bin/env node

/**
 * Script de vérification du modèle 3D BMW
 * Exécution: node check-bmw-model.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification du modèle BMW E34 Stance Style\n');

// 1. Vérifier le fichier existe
const modelPath = path.join(__dirname, 'public', 'models', 'bmw_e34_stance_style.glb');
const srcModelPath = path.join(__dirname, 'src', 'public', 'models', 'bmw_e34_stance_style.glb');

console.log('📂 Emplacements à vérifier:');
console.log(`1. ${modelPath}`);
console.log(`   ✓ Existe: ${fs.existsSync(modelPath)}`);
if (fs.existsSync(modelPath)) {
  const stats = fs.statSync(modelPath);
  console.log(`   ✓ Taille: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

console.log(`\n2. ${srcModelPath}`);
console.log(`   ✓ Existe: ${fs.existsSync(srcModelPath)}`);
if (fs.existsSync(srcModelPath)) {
  const stats = fs.statSync(srcModelPath);
  console.log(`   ✓ Taille: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// 2. Vérifier la configuration 3dModels.ts
console.log('\n🔧 Vérification du code:');
const configPath = path.join(__dirname, 'src', 'utils', '3dModels.ts');
if (fs.existsSync(configPath)) {
  const content = fs.readFileSync(configPath, 'utf8');
  const hasBmwConfig = content.includes('bmw_e34_stance_style.glb');
  const hasDefaultModel = content.includes('export const DEFAULT_CAR_MODEL');
  
  console.log(`✓ Fichier 3dModels.ts existe`);
  console.log(`  - BMW E34 configuré: ${hasBmwConfig}`);
  console.log(`  - DEFAULT_CAR_MODEL défini: ${hasDefaultModel}`);
  
  if (hasBmwConfig && content.includes('DEFAULT_CAR_MODEL = "bmw_e34_stance_style.glb"')) {
    console.log(`  ✅ BMW E34 est le modèle par défaut!`);
  }
}

// 3. Vérifier les dossiers
console.log('\n📁 Structure des dossiers:');
const publicModelsDir = path.join(__dirname, 'public', 'models');
if (fs.existsSync(publicModelsDir)) {
  const files = fs.readdirSync(publicModelsDir);
  console.log(`✓ public/models/ contient ${files.length} fichiers:`);
  files.forEach(f => console.log(`  - ${f}`));
} else {
  console.log(`✗ Dossier public/models/ n'existe pas!`);
}

console.log('\n📋 Instructions suivantes:');
console.log('1. Vérifier http://localhost:5173 dans le browser');
console.log('2. Ouvrir F12 → Console pour voir les erreurs');
console.log('3. Ouvrir F12 → Network → chercher "bmw_e34_stance_style.glb"');
console.log('4. Le modèle doit avoir Status: 200 (pas 404)');

console.log('\n✨ Vérification complète!');
