import { mainAi } from "./ConfigAi.js";

export const searchByAi = async (searchPrompt, items) => {
  const search = searchPrompt.search;

  const Data = await mainAi(search); 
  if(Data){
    const highMatch = [];
    const mediumMatch = [];
    const lowMatch = [];

    items.forEach((item) => {
        const includeItems = item.ingredients.filter((ingredient) => {
            const includeItem = Data.ingredients?.find(I => I.name.toLowerCase() === ingredient.name.toLowerCase());
            console.log(includeItem);
            if (!includeItem) return false;

            const IgdtQty = ingredient.qty / (item.amount / 100);

            const min = Number(includeItem.min_qty);
            const max = Number(includeItem.max_qty);

            return IgdtQty >= min && IgdtQty <= max;
        });
        console.log(includeItems);
        
        const includeItemsNo = includeItems.length;
        const ingredientsNo = item.ingredients.length;
        const includePercentage = (includeItemsNo / ingredientsNo) * 100;
        console.log(includePercentage);
        if (includePercentage > 75) {
            highMatch.push(item);
        } else if (includePercentage > 50) {
            mediumMatch.push(item);
        } else if (includePercentage > 30) {
            lowMatch.push(item);
        }else{
            return {data: null};
        }
    });
    return { data: { highMatch, mediumMatch, lowMatch } }; 
  }else{
    return null;
  }
};