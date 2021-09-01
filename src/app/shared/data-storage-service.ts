import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/services/recipe.service";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{
    
    fetchechingSubject = new Subject<boolean>();

    private url = "https://ng-course-recipe-e12d7-default-rtdb.firebaseio.com/";

    constructor(private client : HttpClient, private recipesService : RecipeService, private authService : AuthService){}


    storeRecipes()
    {
        const recipes = this.recipesService.getRecipes();
        this.client.put(this.url + "recipes.json", recipes).subscribe(response =>{
            console.log(response);
        });
    }

    fetchRecipes() {
        this.fetchechingSubject.next(true);
        return this.client.get<Array<Recipe>>(this.url + "recipes.json")
        .pipe(
            map(recipes => { //pipe to ensure we always have ingredient array which is optional
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients? recipe.ingredients : []}
            });
        }), 
            tap( response => {
            this.recipesService.setRecipes(response); 
            this.fetchechingSubject.next(false);           
            })
        )
    }

}