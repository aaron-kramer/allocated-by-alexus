// Items are now ingredient categories, not specific items.
// Categories: 'produce', 'protein', 'dry_goods', 'liquor'
export const RECIPES = {
  caesar_salad:    { name: 'Caesar Salad',    emoji: '🥗', items: ['produce', 'produce'] },
  tomato_soup:     { name: 'Tomato Soup',     emoji: '🍅', items: ['dry_goods', 'produce'] },
  pasta_marinara:  { name: 'Pasta Marinara',  emoji: '🍝', items: ['dry_goods', 'dry_goods', 'produce'] },
  fish_lemon:      { name: 'Fish & Lemon',    emoji: '🐟', items: ['protein', 'produce'] },
  chicken_plate:   { name: 'Chicken Plate',   emoji: '🍗', items: ['protein', 'produce', 'produce'] },
  rice_bowl:       { name: 'Rice Bowl',       emoji: '🍚', items: ['dry_goods', 'protein', 'produce'] },
  margarita:       { name: 'Margarita',       emoji: '🍹', items: ['liquor', 'produce'] },
  wine_glass:      { name: 'House Wine',      emoji: '🍷', items: ['liquor'] },
  draft_beer:      { name: 'Draft Beer',      emoji: '🍺', items: ['liquor'] },
  citrus_cocktail: { name: 'Citrus Cocktail', emoji: '🍸', items: ['liquor', 'produce', 'produce'] },
  beef_tacos:      { name: 'Beef Tacos',      emoji: '🌮', items: ['protein', 'produce', 'produce'] },
  fruit_cup:       { name: 'Fruit Cup',       emoji: '🍊', items: ['produce', 'produce'] },
}
