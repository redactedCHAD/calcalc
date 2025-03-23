/**
 * Utility functions for interacting with the NutritionIx API
 */

// Base URLs for the NutritionIx API
const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com/v2';
const UPC_LOOKUP_ENDPOINT = '/search/item';

/**
 * Lookup food information by UPC barcode
 * @param {string} upc - The UPC barcode to lookup
 * @returns {Promise<Object>} - The food information
 */
export async function lookupFoodByUPC(upc) {
  try {
    // Check if we have API credentials
    const appId = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_KEY;

    if (!appId || !appKey) {
      console.warn('NutritionIx API credentials are not set. Using mock data.');
      return getMockFoodData(upc);
    }

    const response = await fetch(`${NUTRITIONIX_API_URL}${UPC_LOOKUP_ENDPOINT}?upc=${upc}`, {
      method: 'GET',
      headers: {
        'x-app-id': appId,
        'x-app-key': appKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NutritionIx API error:', errorText);
      
      if (response.status === 404) {
        throw new Error('Food item not found with this barcode');
      }
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.foods || data.foods.length === 0) {
      throw new Error('No food found with this barcode');
    }

    return transformNutritionixData(data.foods[0]);
  } catch (error) {
    console.error('Error looking up food by UPC:', error);
    
    // If we get a specific error about food not found, throw it
    if (error.message.includes('not found')) {
      throw error;
    }
    
    // For other errors, use mock data in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock data due to API error');
      return getMockFoodData(upc);
    }
    
    throw error;
  }
}

/**
 * Transform NutritionIx API response to our app's format
 * @param {Object} food - The food data from NutritionIx
 * @returns {Object} - The transformed food data
 */
function transformNutritionixData(food) {
  return {
    food_name: food.food_name,
    brand_name: food.brand_name,
    serving_qty: food.serving_qty,
    serving_unit: food.serving_unit,
    serving_weight_grams: food.serving_weight_grams,
    calories: Math.round(food.nf_calories),
    protein: food.nf_protein,
    total_fat: food.nf_total_fat,
    total_carbohydrate: food.nf_total_carbohydrate,
    sugars: food.nf_sugars,
    fiber: food.nf_dietary_fiber
  };
}

/**
 * Get mock food data for development and testing
 * @param {string} upc - The UPC barcode
 * @returns {Object} - Mock food data
 */
function getMockFoodData(upc) {
  // Common UPC codes for testing
  const mockDatabase = {
    '049000000443': { // Coca-Cola
      food_name: 'Cola, Coca-Cola',
      brand_name: 'Coca-Cola',
      serving_qty: 1,
      serving_unit: 'can (12 fl oz)',
      serving_weight_grams: 368,
      calories: 140,
      protein: 0,
      total_fat: 0,
      total_carbohydrate: 39,
      sugars: 39,
      fiber: 0
    },
    '021130126026': { // Cheerios
      food_name: 'Cheerios, Original',
      brand_name: 'General Mills',
      serving_qty: 1,
      serving_unit: 'cup (28g)',
      serving_weight_grams: 28,
      calories: 100,
      protein: 3,
      total_fat: 2,
      total_carbohydrate: 20,
      sugars: 1,
      fiber: 3
    },
    '884912129161': { // Kind Bar
      food_name: 'Nuts & Spices Bar, Dark Chocolate Nuts & Sea Salt',
      brand_name: 'KIND',
      serving_qty: 1,
      serving_unit: 'bar (40g)',
      serving_weight_grams: 40,
      calories: 200,
      protein: 6,
      total_fat: 15,
      total_carbohydrate: 16,
      sugars: 5,
      fiber: 7
    }
  };

  // Return the mock data or a generic food item if UPC not in database
  return mockDatabase[upc] || {
    food_name: `Food Item (UPC: ${upc})`,
    brand_name: 'Generic Brand',
    serving_qty: 1,
    serving_unit: 'serving',
    serving_weight_grams: 100,
    calories: 250,
    protein: 5,
    total_fat: 10,
    total_carbohydrate: 30,
    sugars: 15,
    fiber: 2
  };
}

/**
 * Search for food items by name or description
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of food items
 */
export async function searchFoodItems(query) {
  try {
    // Check if we have API credentials
    const appId = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_KEY;

    if (!appId || !appKey) {
      console.warn('NutritionIx API credentials are not set. Using mock data.');
      return getMockSearchResults(query);
    }

    const response = await fetch(`${NUTRITIONIX_API_URL}/search/instant?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-app-id': appId,
        'x-app-key': appKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NutritionIx API error:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.common || !data.branded) {
      throw new Error('Invalid response format from API');
    }

    // Combine and transform results
    const results = [
      ...data.branded.map(item => ({
        food_name: item.food_name,
        brand_name: item.brand_name,
        image: item.photo?.thumb,
        serving_unit: item.serving_unit,
        calories: item.nf_calories
      })),
      ...data.common.map(item => ({
        food_name: item.food_name,
        brand_name: 'Generic',
        image: item.photo?.thumb,
        serving_unit: 'serving',
        calories: null // Calories not available for common foods in search results
      }))
    ].slice(0, 15); // Limit to 15 results

    return results;
  } catch (error) {
    console.error('Error searching for food items:', error);
    
    // For errors, use mock data in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock search results due to API error');
      return getMockSearchResults(query);
    }
    
    throw error;
  }
}

/**
 * Get mock search results for development and testing
 * @param {string} query - The search query
 * @returns {Array} - Mock search results
 */
function getMockSearchResults(query) {
  const lowercaseQuery = query.toLowerCase();
  
  const mockFoods = [
    { food_name: 'Apple', brand_name: 'Generic', serving_unit: 'medium (182g)', calories: 95 },
    { food_name: 'Banana', brand_name: 'Generic', serving_unit: 'medium (118g)', calories: 105 },
    { food_name: 'Orange', brand_name: 'Generic', serving_unit: 'medium (131g)', calories: 62 },
    { food_name: 'Pizza, Pepperoni', brand_name: 'Domino\'s', serving_unit: 'slice (107g)', calories: 313 },
    { food_name: 'Chicken Breast', brand_name: 'Generic', serving_unit: '3 oz (85g)', calories: 142 },
    { food_name: 'Salmon', brand_name: 'Generic', serving_unit: '3 oz (85g)', calories: 175 },
    { food_name: 'Brown Rice', brand_name: 'Generic', serving_unit: '1 cup cooked (195g)', calories: 216 },
    { food_name: 'Yogurt, Greek', brand_name: 'Chobani', serving_unit: '1 container (170g)', calories: 100 }
  ];
  
  // Filter foods based on query
  return mockFoods
    .filter(food => 
      food.food_name.toLowerCase().includes(lowercaseQuery) || 
      food.brand_name.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, 5); // Limit to 5 results
} 