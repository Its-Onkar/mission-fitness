import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USDA_API_KEY = process.env.USDA_API_KEY;

// Function to fetch nutrients from USDA database
export const getFoodNutrients = async (foodName) => {
  try {
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&pageSize=1&api_key=${USDA_API_KEY}`;
    const searchResponse = await axios.get(searchUrl);

    if (!searchResponse.data.foods?.length) {
      return { foodName, error: "No data found" };
    }

    const food = searchResponse.data.foods[0];
    const nutrients = {};

    // Extract relevant nutrient data
    for (const n of food.foodNutrients) {
      const name = n.nutrientName.toLowerCase();
      if (name.includes("protein")) nutrients.protein = `${n.value} ${n.unitName}`;
      else if (name.includes("fat")) nutrients.fat = `${n.value} ${n.unitName}`;
      else if (name.includes("carbohydrate")) nutrients.carbs = `${n.value} ${n.unitName}`;
      else if (name.includes("energy")) nutrients.calories = `${n.value} kcal`;
      else if (name.includes("vitamin")) {
        nutrients.vitamins = nutrients.vitamins || [];
        nutrients.vitamins.push(`${n.nutrientName} (${n.value}${n.unitName})`);
      } else if (name.includes("iron") || name.includes("calcium") || name.includes("magnesium") || name.includes("potassium")) {
        nutrients.minerals = nutrients.minerals || [];
        nutrients.minerals.push(`${n.nutrientName} (${n.value}${n.unitName})`);
      }
    }

    return {
      foodName: food.description,
      nutrients,
    };
  } catch (error) {
    console.error("❌ USDA fetch error:", error.message);
    return { foodName, error: "Failed to fetch nutrient data" };
  }
};
