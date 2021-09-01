import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage-service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./services/recipe.service";

@Injectable({providedIn : 'root'})
export class RecipeResolverService implements Resolve<Array<Recipe>> {

    constructor(private dataStorageSetvice : DataStorageService, private recipesService: RecipeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Array<Recipe> | Observable<Array<Recipe>> | Promise<Array<Recipe>> {
       const recipes = this.recipesService.getRecipes();
        return recipes.length === 0 ? this.dataStorageSetvice.fetchRecipes() : recipes;
    }

}