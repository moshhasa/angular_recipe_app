import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model'

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService  {

  ingredientsChanged = new Subject<Array<Ingredient>>();
  startedEditing = new Subject<number>();

  private ingredients:Array<Ingredient> = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10)
  ];

  constructor() { }

 

  addIngredientAdded(ingredient: Ingredient): void{
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Array<Ingredient>)
  {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  removeIngredient(index : number): void{
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());

  }

  getIngredients(): Array<Ingredient>
  {
    return this.ingredients.slice();
  }

  getIngredient(index : number): Ingredient
  {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) : void 
  {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
