import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
 @ViewChild('f', {static : false}) form: NgForm;
  editMode: boolean = false;
  editedItemIndex: number;
  subscription : Subscription;
  ingredient: Ingredient;

  constructor(private shoppingListService : ShoppingListService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((id: number) => {
      this.editedItemIndex = id;
      this.editMode = true;
      this.ingredient = this.shoppingListService.getIngredient(this.editedItemIndex);
      console.log(this.form);
      this.form.setValue({
        name : this.ingredient.name,
        amount : this.ingredient.amount
      });

    });
  }

  onAdditem(editForm: NgForm) :void
  {
    const name = editForm.value.name;
    const amount = editForm.value.amount;
    const ingredient = new Ingredient(name, amount);
    if(this.editMode)
    {
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
    }
    else
    {
      this.shoppingListService.addIngredientAdded(ingredient);
    } 
    this.onReset();
  }

  onReset(): void
  {
    this.editMode = false;
    this.form.reset();
  }

  onDelete(): void
  {
    this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.onReset();
  }

}
