
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDNSJPu9Nwjen5LPhTAVMGlIuenbJCDnIU" });

export const  mainAi = async (searchPrompt) => {
      const prompt = `
        You are a nutrition assistant.
        Your task is to process the given search prompt and return a JSON object that lists all ingredients from the provided list.

        Rules:
        - Always include all ingredients in the output.
        - For suitable ingredients, assign realistic "min_qty" and "max_qty" values (in grams/ml/pieces).
        - For unsuitable ingredients, set "min_qty": "0" and "max_qty": "0".
        - Ensure that "max_qty" is always less than 100.
        - Ensure that "min_qty" is set realistically based on the situation, but never higher than "max_qty".
        - Output only valid JSON, no explanations.

        Search Prompt:${searchPrompt} 

        Ingredient List:
        grains = [ "Rice", "Basmati Rice", "Brown Rice", "Wheat", "Maize/Corn", "Jowar", "Bajra", "Ragi", "Barley", "Poha", "Dalia", "Sabudana", "Suji/Rava", "Vermicelli", "Oats" ]
        pulses = [ "Toor Dal", "Moong Dal", "Whole Green Moong", "Urad Dal", "Masoor Dal", "Chana Dal", "Whole Chana", "Kabuli Chana", "Rajma", "Lobiya", "Horse Gram", "Moth Beans", "Soya Chunks", "Sprouted Moong", "Sprouted Moth" ]
        vegetables = [ "Potato", "Onion", "Tomato", "Brinjal/Eggplant", "Lady Finger", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Pumpkin", "Cauliflower", "Cabbage", "Capsicum", "Spinach", "Fenugreek Leaves", "Coriander Leaves" ]
        fruits = [ "Mango", "Banana", "Papaya", "Apple", "Guava", "Watermelon", "Muskmelon", "Orange", "Grapes", "Pomegranate", "Lemon", "Litchi", "Sapota/Chikoo", "Pineapple", "Custard Apple" ]
        dairyProducts = [ "Milk", "Curd", "Paneer", "Ghee", "Butter", "Cream", "Chhena", "Khoya/Mawa", "Buttermilk", "Lassi" ]
        spices = [ "Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Seeds", "Mustard Seeds", "Fennel Seeds", "Fenugreek Seeds", "Asafoetida", "Black Pepper", "Cardamom", "Cloves", "Cinnamon", "Bay Leaf", "Dry Mango Powder", "Garam Masala" ]
        oils = [ "Mustard Oil", "Groundnut Oil", "Sunflower Oil", "Coconut Oil", "Desi Ghee" ]
        otherItems = [ "Salt", "Sugar", "Jaggery", "Tamarind", "Gram Flour", "Rice Flour", "Pickles", "Papad", "Dry Fruits", "Tea Leaves" ]

        Output JSON format:
        {
        "ingredients": [
            { "name": "Rice", "min_qty": "", "max_qty": "" },
            { "name": "Basmati Rice", "min_qty": "", "max_qty": "" }
        ],
        "nutrition_focus": "Explain shortly why these ingredients were chosen or avoided based on the search prompt."
        }
        `;


  try{
      console.log('calledAi');
      const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    function safeJsonParse(str) {
      try {
        const jsonPart = str.substring(str.indexOf("{"), str.lastIndexOf("}") + 1);

        return JSON.parse(jsonPart);
      } catch {
        return null;
      }
    }

    const text = response.text;
    const Data = safeJsonParse(text);
    if (Data) {
        return Data;      
      } else {
        return null
      }
  }catch(err){
    console.error(err.message);
  }

}
