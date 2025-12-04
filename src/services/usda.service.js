import axios from 'axios';

const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export const getFoodNutrition = async (foodName) => {
  try {
    console.log(`🔍 Searching USDA for: ${foodName}`);
    
    // Use DEMO_KEY if no API key provided
    const apiKey = USDA_API_KEY || 'DEMO_KEY';
    
    // Search for food
    const searchResponse = await axios.get(`${USDA_BASE_URL}/foods/search`, {
      params: {
        query: foodName,
        api_key: apiKey,
        pageSize: 1
      },
      timeout: 5000
    });

    if (searchResponse.data.foods && searchResponse.data.foods.length > 0) {
      const food = searchResponse.data.foods[0];
      console.log(`✅ Found: ${food.description}`);
      
      // Use basic nutrients from search (faster)
      const nutrients = food.foodNutrients || [];
      
      const nutrition = {
        name: food.description,
        calories: findNutrient(nutrients, 'Energy') || 250,
        protein: findNutrient(nutrients, 'Protein') || 10,
        carbs: findNutrient(nutrients, 'Carbohydrate') || 30,
        fats: findNutrient(nutrients, 'Total lipid') || 8,
        fiber: findNutrient(nutrients, 'Fiber') || 3,
        sugar: findNutrient(nutrients, 'Sugars') || 5,
        sodium: findNutrient(nutrients, 'Sodium') || 200,
        benefits: getFoodBenefits(food.description, nutrients)
      };

      return nutrition;
    }
    
    console.log(`⚠️ No USDA data found for: ${foodName}`);
    return { error: 'No data found' };
  } catch (error) {
    console.error(`❌ USDA API error for ${foodName}:`, error.message);
    return { error: error.message };
  }
};

const findNutrient = (nutrients, name) => {
  const nutrient = nutrients.find(n => {
    const nutrientName = n.nutrient?.name || n.nutrientName || '';
    return nutrientName.toLowerCase().includes(name.toLowerCase());
  });
  return nutrient ? (nutrient.amount || nutrient.value || 0) : 0;
};

const getFoodBenefits = (foodName, nutrients) => {
  const benefits = [];
  const name = foodName.toLowerCase();
  
  // High protein foods
  const protein = findNutrient(nutrients, 'Protein');
  if (protein > 15) {
    benefits.push('High in protein - helps build and repair muscles');
  }
  
  // High fiber foods
  const fiber = findNutrient(nutrients, 'Fiber');
  if (fiber > 3) {
    benefits.push('Good source of fiber - aids digestion and heart health');
  }
  
  // Specific food benefits
  if (name.includes('oat')) {
    benefits.push('Contains beta-glucan - helps lower cholesterol');
  }
  
  if (name.includes('salmon') || name.includes('fish')) {
    benefits.push('Rich in omega-3 fatty acids - supports heart and brain health');
  }
  
  if (name.includes('spinach') || name.includes('kale')) {
    benefits.push('High in iron and vitamins - boosts energy and immunity');
  }
  
  if (name.includes('berries') || name.includes('blueberry')) {
    benefits.push('Rich in antioxidants - fights inflammation and aging');
  }
  
  if (name.includes('quinoa')) {
    benefits.push('Complete protein source - contains all essential amino acids');
  }
  
  if (name.includes('avocado')) {
    benefits.push('Healthy monounsaturated fats - supports heart health');
  }
  
  return benefits.length > 0 ? benefits : ['Provides essential nutrients for overall health'];
};

export const enhanceDietPlanWithUSDA = async (dietPlan) => {
  if (!dietPlan || !dietPlan.dietPlan) return dietPlan;
  
  console.log('🔍 Enhancing diet plan with USDA data...');
  const enhancedPlan = { ...dietPlan };
  
  try {
    for (let day of enhancedPlan.dietPlan) {
      if (day.meals) {
        for (let mealType in day.meals) {
          const meal = day.meals[mealType];
          if (typeof meal === 'string') {
            // Extract main food from meal description
            const foodName = meal.split(/[,(]/)[0].trim().split(' ').slice(0, 2).join(' ');
            console.log(`🥗 Getting nutrition for: ${foodName}`);
            
            const nutrition = await getFoodNutrition(foodName);
            
            if (nutrition && !nutrition.error) {
              day.meals[mealType] = {
                original: meal,
                food: nutrition.name,
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fats: nutrition.fats,
                benefits: nutrition.benefits,
                vitamins: nutrition.fiber ? [`Fiber: ${nutrition.fiber}g`] : [],
                minerals: nutrition.sodium ? [`Sodium: ${nutrition.sodium}mg`] : []
              };
            } else {
              // Keep original if USDA fails
              day.meals[mealType] = {
                original: meal,
                benefits: ['Provides essential nutrients for overall health']
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ USDA enhancement failed:', error.message);
  }
  
  return enhancedPlan;
};