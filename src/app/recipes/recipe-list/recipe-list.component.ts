import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Array<Recipe> ;
  subscrition : Subscription;
  private itemsFetchinSubscription : Subscription;
  fetching: boolean = false;

  constructor(private recipeService : RecipeService, 
              private dataStorageService : DataStorageService,
              private router : Router, private activatedRoute : ActivatedRoute) { }
  
  
  ngOnDestroy(): void {
    this.subscrition.unsubscribe();
    this.itemsFetchinSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.subscrition = this.recipeService.recipeChanged.subscribe((recipes :Array<Recipe>) => {
      this.recipes = recipes;
    });

    this.itemsFetchinSubscription = this.dataStorageService.fetchechingSubject.subscribe(status =>{
      this.fetching = status;
      this.router.navigate(['/recipes']);
    });
  }

  onNewRecipe(): void
  {
    this.router.navigate(['new'], { relativeTo : this.activatedRoute});
  }

}
