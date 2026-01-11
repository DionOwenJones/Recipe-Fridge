// Open Food Facts API - Free, open-source food database
// https://world.openfoodfacts.org/

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export interface ProductInfo {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  quantity?: string;
  imageUrl?: string;
  ingredients?: string;
  nutritionGrade?: string;
}

export interface BarcodeResult {
  found: boolean;
  product?: ProductInfo;
  error?: string;
}

// Map Open Food Facts categories to our app categories
function mapCategory(categories?: string): string {
  if (!categories) return 'Pantry';

  const lower = categories.toLowerCase();

  if (lower.includes('milk') || lower.includes('dairy') || lower.includes('cheese') || lower.includes('yogurt')) {
    return 'Dairy';
  }
  if (lower.includes('meat') || lower.includes('beef') || lower.includes('pork') || lower.includes('lamb')) {
    return 'Meat';
  }
  if (lower.includes('chicken') || lower.includes('poultry') || lower.includes('turkey') || lower.includes('egg')) {
    return 'Protein';
  }
  if (lower.includes('fish') || lower.includes('seafood') || lower.includes('salmon') || lower.includes('tuna')) {
    return 'Seafood';
  }
  if (lower.includes('vegetable') || lower.includes('carrot') || lower.includes('tomato') || lower.includes('onion')) {
    return 'Vegetable';
  }
  if (lower.includes('fruit') || lower.includes('apple') || lower.includes('banana') || lower.includes('orange')) {
    return 'Fruit';
  }
  if (lower.includes('bread') || lower.includes('pasta') || lower.includes('rice') || lower.includes('cereal') || lower.includes('grain')) {
    return 'Grain';
  }
  if (lower.includes('beverage') || lower.includes('drink') || lower.includes('juice') || lower.includes('water')) {
    return 'Beverage';
  }
  if (lower.includes('snack') || lower.includes('chip') || lower.includes('crisp')) {
    return 'Snack';
  }
  if (lower.includes('frozen')) {
    return 'Frozen';
  }
  if (lower.includes('sauce') || lower.includes('condiment') || lower.includes('spice') || lower.includes('herb')) {
    return 'Pantry';
  }

  return 'Pantry';
}

// Extract amount and unit from quantity string
function parseQuantity(quantity?: string): { amount: number; unit: string } {
  if (!quantity) return { amount: 1, unit: 'pcs' };

  const lower = quantity.toLowerCase().trim();

  // Common patterns: "500g", "1L", "250 ml", "6 x 330ml"
  const match = lower.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|oz|lb|pcs|pack|ct|count)?/i);

  if (match) {
    let amount = parseFloat(match[1]);
    let unit = (match[2] || 'pcs').toLowerCase();

    // Normalize units
    if (unit === 'kg') {
      amount *= 1000;
      unit = 'g';
    } else if (unit === 'l') {
      amount *= 1000;
      unit = 'ml';
    } else if (unit === 'oz') {
      amount *= 28.35;
      unit = 'g';
    } else if (unit === 'lb') {
      amount *= 453.6;
      unit = 'g';
    } else if (unit === 'pack' || unit === 'ct' || unit === 'count') {
      unit = 'pcs';
    }

    return { amount: Math.round(amount), unit };
  }

  return { amount: 1, unit: 'pcs' };
}

export async function lookupBarcode(barcode: string): Promise<BarcodeResult> {
  try {
    // Clean the barcode - remove any non-numeric characters
    const cleanBarcode = barcode.replace(/\D/g, '');

    const response = await fetch(`${BASE_URL}/product/${cleanBarcode}.json`, {
      headers: {
        'User-Agent': 'RecipeFridge/1.0 (https://github.com/recipe-fridge)',
      },
    });

    if (!response.ok) {
      return { found: false, error: 'Failed to fetch product information' };
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return { found: false, error: 'Product not found in database' };
    }

    const product = data.product;
    const parsedQuantity = parseQuantity(product.quantity);

    return {
      found: true,
      product: {
        barcode: cleanBarcode,
        name: product.product_name || product.product_name_en || 'Unknown Product',
        brand: product.brands,
        category: mapCategory(product.categories),
        quantity: product.quantity,
        imageUrl: product.image_front_small_url || product.image_url,
        ingredients: product.ingredients_text,
        nutritionGrade: product.nutrition_grades,
        ...parsedQuantity,
      } as ProductInfo & { amount: number; unit: string },
    };
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return { found: false, error: 'Network error - please try again' };
  }
}

// Alternative: UPC Database lookup (backup)
export async function lookupBarcodeAlt(barcode: string): Promise<BarcodeResult> {
  // This is a fallback - Open Food Facts should cover most cases
  // For products not found, we return a "not found" result
  // so users can manually enter the product
  return { found: false, error: 'Product not found' };
}
