import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
    public name: String;
    public description: String;
    public imagePath: String;
    public ingredients: Array<Ingredient>;

    constructor(name: String, description: String, imagePath:String, ingredients: Array<Ingredient>)
    {
        this.description = description;
        this.name = name;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    }
}