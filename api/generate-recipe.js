import { handleRecipeRequest } from '../server/recipeApiHandler.js';

export default async function handler(req, res) {
  await handleRecipeRequest(req, res, process.env);
}
