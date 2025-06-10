import express from 'express';
import Recipe from '../models/recipe.js'; // Import the Recipe model
const recipeRoute = express.Router();

/*recipeRoute.route('/').get((req, res, next) => {
  Recipe.find() // To get all recipes
    .sort({recipeID: -1})
    .limit(500)
    .exec()
    .then((recipes) => {
      res.json(recipes); // return recipes in JSON format
  }).catch(err => next(err));
});

// Get all recipes
recipeRoute.route('/pagination/:page').get((req, res, next) => {
  Recipe.find() // To get all recipes
    .sort({recipeID: -1})
    .skip(req.params.page * 100)
    .limit(100)
    .exec()
    .then((recipes) => {
      res.json(recipes); // return recipes in JSON format
  }).catch(err => next(err));
});*/

recipeRoute.route('/').get((req, res, next) => {
  const limit = 20;
  const lastId = req.query.lastId;

  const query = lastId ? { recipeID: { $lt: lastId } } : {};

  Recipe.find(query) // To get all recipes
    .sort({recipeID: -1})
    .limit(limit)
    .exec()
    .then((recipes) => {
      res.json({
        recipes,
        lastId: recipes.length > 0 ? recipes[recipes.length - 1].recipeID : null,
        hasMore: recipes.length === limit
      });
  }).catch(err => next(err));
});

recipeRoute.route('/count').get((req, res, next) => {
  Recipe.count()
  .then((count) => {
    res.json(count);
  }).catch(err => next(err));
});

// Get a recipe
recipeRoute.route('/:id').get((req, res, next) => {
  Recipe.findOne({ recipeID: Number(req.params.id) }) // Pour récupérer la recipe avec cet id
  .exec()
  .then(data => res.json(data)) // return recipe in JSON format
  .catch(err => next(err));
});

// Update Recipe
recipeRoute.route('/:id').put(async (req, res, next) => {
  const {fields, values, action} = req.body;

  // get the recipe
  let recipe = await Recipe.findOne({ recipeID: req.params.id })
  .exec();

  if (action === "add"){
    for(let i=0; i < fields.length; i++){
      recipe[fields[i]].push(values[i]);
    }
  } else if (action === "remove"){
      for(let i=0; i < fields.length; i++){
        let f = fields[i];
        switch (f) {
          case 'comments':
            let commentToDeleted = recipe[f].find((c) => {
              const [nodeDay, nodeHours] = c.postedAt.toLocaleString('fr-FR').split(" ");
              const [nYear, nMonth, nDay] = nodeDay.split("-");
              values[i] = values[i].replace(" à ", " ");
              const [valueDay, valueHours] = values[i].split(" ");
              const [vDay, vMonth, vYear] = valueDay.split("/");

              return (nodeHours === valueHours) && (vDay === nDay.padStart(2,'0')) && (vMonth === nMonth.padStart(2, '0')) && (vYear === nYear)
            });
            recipe[f].remove(commentToDeleted);
            break;

          case 'deletedBy':
          case 'validatedBy':
            recipe[f].remove(values[i]);
            break;

          default:
            console.log(`Sorry, we are out of ${expr} to delete it`);
        }
      };
  } else { //replace
    for(let i=0; i < fields.length; i++){
      let f = fields[i];
        switch (f) {
          case 'comments':
            let commentIndex = recipe[f].findIndex((c) => {
              const [nodeDay, nodeHours] = c.postedAt.toLocaleString('fr-FR').split(" ");
              const [nYear, nMonth, nDay] = nodeDay.split("-");
              values[i].date = values[i].date.replace(" à ", " ");
              const [valueDay, valueHours] = values[i].date.split(" ");
              const [vDay, vMonth, vYear] = valueDay.split("/");

              return (nodeHours === valueHours) && (vDay === nDay.padStart(2,'0')) && (vMonth === nMonth.padStart(2, '0')) && (vYear === nYear)
            });

            recipe[f][commentIndex].text = values[i].text;
            break;

          case 'ingredients':
          case 'steps':
          case 'tags':
            recipe[f] = [];
            values[i].forEach((item) => {
              recipe[f].push(item);
            });
            break;
          default:
            recipe[f] = values[i];
        }
    };
  }
  // save
  await recipe.save();
  // send the new value
  res.json(recipe);
})

// Create Recipe
recipeRoute.route('/').post(async (req, res, next) => {

  const recipe = new Recipe();
  recipe.recipeID = req.body.recipe.recipeID;
  recipe.category = req.body.recipe.category;
  recipe.title = req.body.recipe.title;
  recipe.prepPeriod = req.body.recipe.prepPeriod;
  recipe.cookPeriod = req.body.recipe.cookPeriod;
  recipe.restPeriod = req.body.recipe.restPeriod;
  recipe.nbPeople = req.body.recipe.nbPeople;
  recipe.nbPeopleUnit = req.body.recipe.nbPeopleUnit;
  recipe.meatClass = req.body.recipe.meatClass;
  recipe.chiefTrick = req.body.recipe.chiefTrick;
  recipe.video = req.body.recipe.video;
  recipe.spicy = Number(req.body.recipe.spicy);
  recipe.ingredients = req.body.recipe.ingredients;
  recipe.steps = req.body.recipe.steps;
  recipe.tags = req.body.recipe.tags;

  // save
  await recipe.save();
  // send the new value
  res.json(recipe);
});

// Delete Recipe definitively
recipeRoute.route('/:id').delete((req, res, next) => {
  Recipe.findOneAndRemove({ recipeID: req.params.id }, (error, data) => {
      if (error) return next(error);
      else res.status(200).json({ msg: data });
  })
})

export default recipeRoute;