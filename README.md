<div align="center">

<img src="assets/screenshots/Screenshot.png" alt="Recipe Fridge App" width="300" align="center" />

# 🥑 Recipe Fridge

**The open-source kitchen companion for real home cooks.**

Tired of forgetting what’s in your fridge? Want to discover new recipes with what you already have? Recipe Fridge is your all-in-one, privacy-friendly kitchen manager and recipe explorer. Built for foodies, meal preppers, and anyone who hates food waste.

---

---

## ✨ Why You'll Love It

- 🧊 **Zero-stress Kitchen Inventory:** Know exactly what’s in your fridge, freezer, and pantry—anytime, anywhere.
- 🏷️ **Smart, Colorful Categories:** Instantly spot Dairy, Meat, Protein, Veggies, Fruit, and more with beautiful color coding.
- ⏰ **Expiry Radar:** See what’s fresh, what’s expiring soon, and what’s already gone (so you can save money and the planet).
- 🍳 **Recipe Magic:** Find recipes you can actually cook, powered by TheMealDB & Spoonacular APIs.
- 📦 **Barcode Scanning:** Add groceries in a snap (where supported).
- 🛒 **Shopping List:** Build your next grocery run from missing ingredients—never double-buy again.
- 🔔 **Expiry Reminders:** Get notified before food goes bad (if you want).
- 🎨 **Modern, Delightful UI:** Responsive, haptic, and just plain nice to use.

---

---

## 📸 Screenshots

<p align="center">
   <img src="assets/screenshots/Screenshot.png" alt="Home Screen" width="250" />
</p>

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/recipe-fridge.git
cd recipe-fridge
```

### 2. Install dependencies

```sh
npm install
# or
yarn
```

### 3. Add your own `app.json`

This project requires an `app.json` file in the root directory for Expo configuration. Here is a template you can use:

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

> **Note:** Replace `bundleIdentifier` and other fields as needed for your own project or Expo account.

### 4. Start the app

```sh
npx expo start
```

- Open in Expo Go (iOS/Android) or use an emulator.

---

## 🗂️ Project Structure

- <b>src/components/</b> – UI components (IngredientCard, RecipeCard, Modals, etc.)
- <b>src/screens/</b> – App screens (Home, Kitchen, Recipes, Shopping, Settings)
- <b>src/context/</b> – Global state (KitchenContext)
- <b>src/services/</b> – API integrations (TheMealDB, Spoonacular, barcode, notifications)
- <b>src/types/</b> – TypeScript types (ingredient, recipe, shopping)
- <b>src/theme/</b> – Colors, spacing, typography
- <b>assets/</b> – Images, icons, screenshots

---

## 🙌 Why Recipe Fridge?

- <b>Save money</b> by using what you have
- <b>Reduce food waste</b> with expiry reminders
- <b>Get inspired</b> with new recipes every day
- <b>Open source</b> and MIT licensed

---

## 📄 License

MIT License. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
   <i>Made with ❤️ by Dion Jones</i>
</p>
