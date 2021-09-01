import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo : '/recipes', pathMatch : 'full' },
 //   { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' } //this is for lazy loading
    { path: 'recipes', loadChildren: () => import("./recipes/recipes.module").then(m => m.RecipesModule) }, //this is for lazy loading
    { path: 'shopping-list', loadChildren: () => import("./shopping-list/shopping-list.module").then(m => m.ShoppingListModule) } //this is for lazy loading
   
]
@NgModule({
    imports : [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})],
    exports : [RouterModule]
})
export class AppRouteModule {

}