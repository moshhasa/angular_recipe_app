import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = null;
  id: number;
  constructor(private recipeService : RecipeService,
              private router: Router,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.params['id'];
    this.recipe = this.recipeService.getRecipe(this.id);
    this.activatedRoute.params.subscribe((params : Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onAddToShoppingList(): void
  {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void
  {
    this.router.navigate(['edit'], { relativeTo : this.activatedRoute});
  }

  onDeleteRecipe(): void
  {
    if(confirm("Do you want to delete " + this.recipe.name + "?"))
    {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes']);
    }
  }

}
