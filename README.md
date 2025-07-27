# 🇨🇭 Site Web - Résidence en Suisse

Site web promotionnel pour **France Web Services Ltd** présentant les services d'obtention de résidence en Suisse avec le Permis B.

## 🎯 Objectif

Promouvoir les services légaux d'obtention de résidence suisse via les services cantonaux de Zurich, avec différents forfaits adaptés aux besoins des clients.

## 🚀 Fonctionnalités

### 📱 Design Responsive
- Interface moderne aux couleurs de la Suisse (rouge et blanc)
- Adaptation parfaite sur mobile, tablette et desktop
- Navigation mobile avec menu hamburger

### 🎨 Interface Utilisateur
- Design élégant avec dégradés et ombres sophistiquées
- Animations fluides et effets de parallaxe
- Cartes interactives avec effets hover
- Système de notifications intégré

### 📋 Sections du Site

1. **Header avec Navigation**
   - Logo avec drapeau suisse
   - Menu de navigation fixe avec effet de transparence

2. **Section Hero**
   - Titre principal avec effet de frappe
   - Prix de départ mis en évidence
   - Boutons d'action avec animations
   - Image de paysage suisse

3. **Section Avantages**
   - 4 cartes présentant les avantages de la Suisse
   - Icônes et animations au scroll

4. **Section Forfaits Résidence**
   - **Permis B** : 8'650 CHF
   - **Permis B + Adresse (5 ans)** : 10'500 CHF
   - **Permis B + Adresse + Banque** : 11'500 CHF
   - **Permis B + Permis Conduire + Adresse** : 11'000 CHF
   - **Forfait Complet** : 12'500 CHF

5. **Section Solutions Entreprises**
   - **SARL (GmbH)** : 16'000 CHF
   - **SA (AG)** : 25'000 CHF

6. **Section Processus**
   - 4 étapes du processus expliquées visuellement

7. **Section Contact**
   - Formulaire de contact interactif
   - Informations de contact
   - Validation des données

8. **Footer**
   - Liens utiles et informations légales

### ⚡ Fonctionnalités JavaScript

- **Navigation fluide** entre les sections
- **Animations au scroll** avec Intersection Observer
- **Formulaire de contact** avec validation
- **Système de notifications** pour les interactions
- **Compteurs animés** pour les prix
- **Effet de particules** en arrière-plan
- **Menu mobile** responsive
- **Optimisation des performances** avec debounce

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : 
  - Variables CSS personnalisées
  - Flexbox et CSS Grid
  - Animations et transitions
  - Design responsive
- **JavaScript ES6+** :
  - Modules modernes
  - API Intersection Observer
  - Gestion d'événements
  - Manipulation du DOM

## 📁 Structure des Fichiers

```
├── index.html          # Page principale
├── style.css           # Styles CSS
├── script.js           # Fonctionnalités JavaScript
└── README.md          # Documentation
```

## 🚀 Installation et Utilisation

1. **Cloner ou télécharger** les fichiers
2. **Ouvrir** `index.html` dans un navigateur web
3. **Ou utiliser un serveur local** :
   ```bash
   python3 -m http.server 8000
   ```
   Puis ouvrir `http://localhost:8000`

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans les variables CSS :
```css
--swiss-red: #FF0000;
--swiss-white: #FFFFFF;
--swiss-red-dark: #CC0000;
```

### Prix et Services
Modifier les prix et descriptions dans le HTML, section `#packages` et `#entreprises`.

### Images
Remplacer les URLs d'images Unsplash par vos propres images :
- Image hero : Paysage suisse
- Drapeaux : Utilisation de l'API flagcdn.com

## 📱 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS/Android)

## 🔧 Optimisations

- **Performance** : Utilisation de debounce pour les événements scroll
- **Accessibilité** : Navigation au clavier, contrastes respectés
- **SEO** : Structure HTML sémantique, meta tags appropriés
- **Mobile-first** : Design responsive adaptatif

## 📞 Contact

**France Web Services Ltd**
- Site web : [francewebservices.fr](https://francewebservices.fr)
- Email : contact@francewebservices.fr

## ⚖️ Légal

Services légaux proposés via les autorités cantonales suisses. Tous les prix sont en francs suisses (CHF).

---

*Développé avec ❤️ pour France Web Services Ltd*