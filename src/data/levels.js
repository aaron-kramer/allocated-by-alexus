import { ITEM_DEFS } from './items.js'
import { ZONE_DEFS } from './zones.js'

export const makeItemId = (type, idx) => `${type}_${idx}`
export const getItemType = (itemId) => itemId.split('_').slice(0, -1).join('_')
export const getItemDef = (itemId) => ITEM_DEFS[getItemType(itemId)]

export const LEVELS = [
  {
    id: 1,
    day: 'MONDAY',
    title: 'Monday Morning',
    subtitle: 'Kitchen Only — Tutorial',
    description: '3 crates · 15 items · Kitchen setup',
    zones: ['walkin', 'prep_station', 'dry_storage', 'dishpit', 'cook_line', 'service_station'],
    crates: [
      {
        id: 'c1', label: 'CRATE 1',
        items: [
          makeItemId('tomatoes', 0), makeItemId('onions', 0), makeItemId('lettuce', 0),
          makeItemId('lemons', 0), makeItemId('flour', 0),
        ],
      },
      {
        id: 'c2', label: 'CRATE 2',
        items: [
          makeItemId('sugar', 0), makeItemId('rice', 0), makeItemId('pasta', 0),
          makeItemId('canned_tomatoes', 0), makeItemId('tongs', 0),
        ],
      },
      {
        id: 'c3', label: 'CRATE 3',
        items: [
          makeItemId('spatula', 0), makeItemId('dish_soap', 0), makeItemId('gloves', 0),
          makeItemId('napkins', 0), makeItemId('towels', 0),
        ],
      },
    ],
  },
  {
    id: 2,
    day: 'WEDNESDAY',
    title: 'Wednesday Restock',
    subtitle: 'Kitchen + Bar',
    description: '4 crates · 20 items · Add bar zones',
    zones: ['walkin', 'prep_station', 'dry_storage', 'dishpit', 'cook_line', 'bar_shelves', 'bar_cooler', 'service_station'],
    crates: [
      {
        id: 'c1', label: 'CRATE 1',
        items: [
          makeItemId('chicken', 0), makeItemId('fish', 0), makeItemId('beef_box', 0),
          makeItemId('tomatoes', 1), makeItemId('limes', 0),
        ],
      },
      {
        id: 'c2', label: 'CRATE 2',
        items: [
          makeItemId('oranges', 0), makeItemId('liquor_bottle', 0), makeItemId('liquor_bottle', 1),
          makeItemId('wine_bottle', 0), makeItemId('beer_keg', 0),
        ],
      },
      {
        id: 'c3', label: 'CRATE 3',
        items: [
          makeItemId('flour', 1), makeItemId('rice', 1), makeItemId('pasta', 1),
          makeItemId('canned_tomatoes', 1), makeItemId('sanitizer', 0),
        ],
      },
      {
        id: 'c4', label: 'CRATE 4',
        items: [
          makeItemId('sheet_pan', 0), makeItemId('hotel_pan', 0), makeItemId('to_go_containers', 0),
          makeItemId('apron', 0), makeItemId('gloves', 1),
        ],
      },
    ],
  },
  {
    id: 3,
    day: 'FRIDAY',
    title: 'Friday Before Service',
    subtitle: 'Full Restaurant',
    description: '5 crates · 27 items · Mixed placements',
    zones: [
      'walkin', 'prep_station', 'dry_storage', 'dishpit', 'cook_line',
      'bar_shelves', 'bar_cooler', 'service_station', 'linen_shelf', 'chemical_storage',
    ],
    crates: [
      {
        id: 'c1', label: 'CRATE 1',
        items: [
          makeItemId('chicken', 1), makeItemId('fish', 1), makeItemId('beef_box', 1),
          makeItemId('tomatoes', 2), makeItemId('onions', 1), makeItemId('lettuce', 1),
        ],
      },
      {
        id: 'c2', label: 'CRATE 2',
        items: [
          makeItemId('lemons', 1), makeItemId('limes', 1), makeItemId('oranges', 1),
          makeItemId('liquor_bottle', 2), makeItemId('wine_bottle', 1), makeItemId('beer_keg', 1),
        ],
      },
      {
        id: 'c3', label: 'CRATE 3',
        items: [
          makeItemId('flour', 2), makeItemId('sugar', 1), makeItemId('rice', 2),
          makeItemId('pasta', 2), makeItemId('canned_tomatoes', 2), makeItemId('sheet_pan', 1),
        ],
      },
      {
        id: 'c4', label: 'CRATE 4',
        items: [
          makeItemId('hotel_pan', 1), makeItemId('tongs', 1), makeItemId('spatula', 1),
          makeItemId('napkins', 1), makeItemId('to_go_containers', 1),
        ],
      },
      {
        id: 'c5', label: 'CRATE 5',
        items: [
          makeItemId('sanitizer', 1), makeItemId('dish_soap', 1), makeItemId('gloves', 2),
          makeItemId('apron', 1), makeItemId('towels', 1), makeItemId('tablecloth', 0),
        ],
      },
    ],
  },
]
