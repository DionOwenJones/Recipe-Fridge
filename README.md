# 🥑 Recipe Fridge

<p align="center">
  <a href="https://expo.dev/"><img alt="Expo" src="https://img.shields.io/badge/Built%20with-Expo-4630EB?logo=expo&logoColor=white&style=flat-square"></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square"></a>
  <a href="https://github.com/yourusername/recipe-fridge"><img alt="Stars" src="https://img.shields.io/github/stars/yourusername/recipe-fridge?style=flat-square"></a>
  <a href="https://github.com/yourusername/recipe-fridge/issues"><img alt="Issues" src="https://img.shields.io/github/issues/yourusername/recipe-fridge?style=flat-square"></a>
</p>

<p align="center">
  <b>A beautiful, open-source kitchen & recipe manager for real home cooks.</b><br>
  <i>Track your fridge. Discover new recipes. Waste less food. Eat better.</i>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quickstart">Quickstart</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a>
</p>

---

<p align="center">
  <img alt="Random Panda" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" width="60%" />
</p>

---

## ✨ Features

| 🧊 Inventory                        | 🏷️ Categories                                              | ⏰ Expiry Radar                        | 🍳 Recipe Magic                    |
| :---------------------------------- | :--------------------------------------------------------- | :------------------------------------- | :--------------------------------- |
| Manage your fridge, pantry, freezer | Color-coded for Dairy, Meat, Protein, Veggies, Fruit, etc. | See what’s fresh, expiring, or expired | Find recipes you can actually cook |
| 📦 Barcode Scanning                 | 🛒 Shopping List                                           | 🔔 Expiry Reminders                    | 🎨 Modern UI                       |
| Add groceries in a snap             | Build your next grocery run                                | Get notified before food goes bad      | Responsive, haptic, and delightful |

---

## 🚀 Quickstart

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/recipe-fridge.git
   cd recipe-fridge
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn
   ```
3. **Add your own `app.json`:**
   ```json
   {
     "expo": {
       "name": "recipe-fridge",
       "slug": "recipe-fridge",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "userInterfaceStyle": "light",
       "splash": {
         "image": "./assets/splash-icon.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.yourcompany.recipefridge"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#ffffff"
         }
       },
       "web": {
         "favicon": "./assets/favicon.png"
       }
     }
   }
   ```
   _Replace `bundleIdentifier` and other fields as needed._
4. **Start the app:**
   ```sh
   npx expo start
   ```
   - Open in Expo Go (iOS/Android) or use an emulator.

---

## 🗂️ Project Structure

```text
src/components/   # UI components (IngredientCard, RecipeCard, Modals, etc.)
src/screens/      # App screens (Home, Kitchen, Recipes, Shopping, Settings)
src/context/      # Global state (KitchenContext)
src/services/     # API integrations (TheMealDB, Spoonacular, barcode, notifications)
src/types/        # TypeScript types (ingredient, recipe, shopping)
src/theme/        # Colors, spacing, typography
assets/           # Images, icons, screenshots
```

---

## 🥄 How It Works

1. **Add your ingredients** – Scan barcodes or enter manually.
2. **Track expiry** – See what’s fresh, what’s expiring, and what’s expired.
3. **Discover recipes** – Find meals you can make with what you have.
4. **Build your shopping list** – Never double-buy or forget an ingredient again.

---

## 🛠 Tech Stack

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-20232A?logo=react&logoColor=61DAFB&style=flat-square">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-4630EB?logo=expo&logoColor=white&style=flat-square">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square">
  <img alt="TheMealDB API" src="https://img.shields.io/badge/API-TheMealDB-FF7043?style=flat-square">
</p>

---

## 👥 Contributors

<p align="center">
  <a href="https://github.com/DionOwenJones">
    <img src="https://avatars.githubusercontent.com/u/22296420?v=4" width="80" height="80" style="border-radius:50%" alt="DionOwenJones"/>
    <br/>
    <b>DionOwenJones</b>
  </a>
</p>

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center"><i>Made with ❤️ by Dion Jones</i></p>
