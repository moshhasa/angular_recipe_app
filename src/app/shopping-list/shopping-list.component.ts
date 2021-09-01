import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage-service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients:Array<Ingredient>;
  private ingredientsChangedSubScription : Subscription;
  

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSubScription = this.shoppingListService.ingredientsChanged.subscribe((ingredients : Array<Ingredient>) => {
      this.ingredients = ingredients;
    });
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubScription.unsubscribe();
  }

  onEditItem(index: number) :void {
    this.shoppingListService.startedEditing.next(index);
  }


}
