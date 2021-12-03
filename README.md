# recipes-parser

Generates JSON files based on recipes and their metadata.

## Input

My typical recipe file looks like this:

    # Cake

    TAGS: sweet
    SHOPPING LIST: flour, sugar, eggs
    FROM: https://www.bakeacake.com
    SERVES: 8
    TIME: 2 hours

    ## Ingredients

    1 kg sugar
    5 eggs
    500g flour

    ## Directions

    - Mix everything
    - Put it in a cake tin
    - Cook at 180 degrees for 1 hour

    ## Notes

    Any notes go here

    ## Leftovers

    - 1 egg

## Output

The above file is parsed into JSON:

    {
      "recipe": "Cake",
      "filename": "recipes/cake.txt",
      "metaData": {
        "tags": [ "sweet" ],
        "shoppingList": [ "flour", "sugar", "eggs" ],
        "from": "https://www.bakeacake.com",
        "serves": "8",
        "time": "2 hours"
      },
      "ingredients": [
        "1 kg sugar",
        "6 eggs",
        "500g flour"
      ],
      "directions": [
        "- Mix everything"
        "- Put it in a cake tin"
        "- Cook at 180 degrees for 1 hour"
      ],
      "notes": "Any notes go here",
      "leftovers": [
        "1 egg"
      ],
      "fullText": [
        "(full text of the recipe for searching etc.)"
      ]
    }
