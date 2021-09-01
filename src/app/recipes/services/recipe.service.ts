import { EventEmitter, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { Recipe } from '../recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService implements OnInit{

  recipeChanged = new Subject<Array<Recipe>>();

  private recipes: Array<Recipe> = [] ;

  constructor(private shoppingListService : ShoppingListService) { }
 

  ngOnInit(): void {
    
  }



  addIngredientsToShoppingList(ingredients : Array<Ingredient>) : void
  {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipes():  Array<Recipe>
  {
    return this.recipes.slice();
  }

  addRecipe(recipe: Recipe): void
  {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) : void
  {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  
  deleteRecipe(index: number) : void
  {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }


  getRecipe(id : number) : Recipe
  {
    return this.recipes[id];
  }

  setRecipes(recipes : Array<Recipe>)
  {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
}
