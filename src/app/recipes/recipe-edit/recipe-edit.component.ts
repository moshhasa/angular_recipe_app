import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean  = false;
  recipeForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private recipeService : RecipeService) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.route.params.subscribe((params : Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });

    // this.editMode = +this.route.snapshot.queryParams['id'] !== null;
    // this.route.queryParams.subscribe((params : Params) => {
    //   this.editMode = +params['id'] !== null;
    // });

  }


  onCancelEdit() :void
  {
      this.router.navigate(['../'], {relativeTo : this.route} );
  }

  onSubmit(): void {
    // const recipe = new Recipe(this.recipeForm.value['name'], 
    //                            this.recipeForm.value['description'],
    //                            this.recipeForm.value['imagePath'],
    //                            this.recipeForm.value['ingredients']);
    if(this.editMode)
    {
     // this.recipeService.updateRecipe(this.id, recipe);
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else
    {
     // this.recipeService.addRecipe(recipe);
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.router.navigate(['../'], {relativeTo : this.route} );
  }

  get controls() { 
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onRemoveIngredient(index: number):void
  {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push( new FormGroup({
      name: new FormControl(null,  Validators.required),
      amount: new FormControl(null, [
        Validators.required, 
        Validators.pattern(/^[1-9+[0-9]*$/)
      ]),
    }));
  }

  private initForm(): void
  {
    let recipeName: String = '';
    let recipeImagePath: String = '';
    let recipeDeascription: String = '';
    let recipeIngredient = new FormArray([]);

    if(this.editMode)
    {
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName =  recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDeascription = recipe.description;
      if(recipe['ingredients'])
      {
        for (const ingredient of recipe.ingredients) {
          recipeIngredient.push( new FormGroup({
            'name' : new FormControl(ingredient.name,  Validators.required),
            'amount' : new FormControl(ingredient.amount, [
              Validators.required, 
              Validators.pattern(/^[1-9+[0-9]*$/)
            ])
          }));
        }
      }
    }
  
    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath' : new FormControl(recipeImagePath,  Validators.required),
      'description' : new FormControl(recipeDeascription,  Validators.required),
      ingredients : recipeIngredient
     });
  }

}
