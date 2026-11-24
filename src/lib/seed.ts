import type { Category, Menu, MenuTheme, Restaurant, User } from './types'
import { uid } from './utils'

const img = (name: string) => `/images/dishes/${name}.jpg`

export const DEFAULT_THEME: MenuTheme = {
  preset: 'lavender',
  accent: '#6A4BE0',
  font: 'classic',
  layout: 'list',
  showImages: true,
  showCategoryNav: true,
  cover: '/images/hero-dish.jpg',
}

export const demoUser: User = { name: 'Mehenna', email: 'mehenna@lejardin.dz', plan: 'free' }

export const demoRestaurant: Restaurant = {
  name: 'Le Jardin',
  tagline: 'Restaurant',
  cuisine: 'Modern French Restaurant',
  phone: '+213 555 123 456',
  email: 'bonjour@lejardin.dz',
  address: '12 Rue des Oliviers, Alger',
  hours: 'Tue – Sun · 12:00 – 23:00',
  instagram: '@lejardin.alger',
  website: 'lejardin.dz',
  currency: 'USD',
}

function demoCategories(): Category[] {
  return [
    {
      id: uid('c_'),
      name: 'Starters',
      icon: 'utensils',
      dishes: [
        { id: uid('d_'), name: 'Burrata Salad', description: 'Fresh burrata, heirloom tomatoes, basil oil', price: 16, image: img('burrata'), available: true, tags: ['vegetarian', 'chef'] },
        { id: uid('d_'), name: 'French Onion Soup', description: 'Caramelized onions, gruyère crouton', price: 14, image: img('onion-soup'), available: true, tags: [] },
        { id: uid('d_'), name: 'Smoked Salmon', description: 'House-smoked salmon, dill crème, toast', price: 18, image: img('smoked-salmon'), available: true, tags: [] },
      ],
    },
    {
      id: uid('c_'),
      name: 'Main Courses',
      icon: 'cloche',
      dishes: [
        { id: uid('d_'), name: 'Grilled Salmon', description: 'Herb crust, seasonal vegetables, lemon butter', price: 28, image: img('grilled-salmon'), available: true, tags: ['gluten-free'] },
        { id: uid('d_'), name: 'Beef Tenderloin', description: 'Truffle sauce, fondant potatoes', price: 36, image: img('beef-tenderloin'), available: true, tags: ['chef'] },
        { id: uid('d_'), name: 'Vegetarian Risotto', description: 'Wild mushrooms, aged parmesan, thyme', price: 24, image: img('risotto'), available: true, tags: ['vegetarian'] },
        { id: uid('d_'), name: 'Sea Bass Fillet', description: 'Spinach, red currants, brown butter jus', price: 32, image: '/images/hero-dish.jpg', available: false, tags: ['new'] },
      ],
    },
    {
      id: uid('c_'),
      name: 'Desserts',
      icon: 'cake',
      dishes: [
        { id: uid('d_'), name: 'Chocolate Fondant', description: 'Warm chocolate cake, vanilla ice cream', price: 14, image: img('chocolate-fondant'), available: true, tags: [] },
        { id: uid('d_'), name: 'Crème Brûlée', description: 'Madagascar vanilla, fresh berries', price: 12, image: img('creme-brulee'), available: true, tags: ['gluten-free'] },
      ],
    },
    {
      id: uid('c_'),
      name: 'Drinks',
      icon: 'drink',
      dishes: [
        { id: uid('d_'), name: 'Mint Lemonade', description: 'Fresh lemons, garden mint, sparkling water', price: 6, image: img('lemonade'), available: true, tags: ['vegan'] },
        { id: uid('d_'), name: 'Espresso', description: 'Single origin, roasted locally', price: 4, available: true, tags: [] },
        { id: uid('d_'), name: 'Sparkling Water', description: 'San Pellegrino · 75cl', price: 5, available: true, tags: [] },
      ],
    },
  ]
}

export function createDemoMenus(): Menu[] {
  const now = Date.now()
  return [
    {
      id: uid('m_'),
      name: 'Main Menu',
      slug: 'le-jardin',
      status: 'published',
      createdAt: now - 1000 * 60 * 60 * 24 * 40,
      updatedAt: now - 1000 * 60 * 2,
      publishedAt: now - 1000 * 60 * 60 * 24 * 38,
      views: 12480,
      theme: { ...DEFAULT_THEME },
      categories: demoCategories(),
    },
    {
      id: uid('m_'),
      name: 'Weekend Brunch',
      slug: 'le-jardin-brunch',
      status: 'draft',
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
      updatedAt: now - 1000 * 60 * 60 * 5,
      views: 0,
      theme: { ...DEFAULT_THEME, preset: 'cream', accent: '#A4733F', font: 'elegant', layout: 'cards', cover: '/images/dishes/creme-brulee.jpg' },
      categories: [
        {
          id: uid('c_'),
          name: 'Brunch Classics',
          icon: 'croissant',
          dishes: [
            { id: uid('d_'), name: 'Smoked Salmon Toast', description: 'Sourdough, dill crème, capers', price: 15, image: img('smoked-salmon'), available: true, tags: [] },
            { id: uid('d_'), name: 'Burrata & Tomatoes', description: 'Basil oil, toasted focaccia', price: 13, image: img('burrata'), available: true, tags: ['vegetarian'] },
          ],
        },
        {
          id: uid('c_'),
          name: 'Sweet Treats',
          icon: 'cake',
          dishes: [
            { id: uid('d_'), name: 'Crème Brûlée', description: 'Vanilla bean, berries', price: 9, image: img('creme-brulee'), available: true, tags: [] },
          ],
        },
      ],
    },
  ]
}

export function createStarterMenu(slug: string): Menu {
  const now = Date.now()
  const blank = (name: string, icon: Category['icon']): Category => ({ id: uid('c_'), name, icon, dishes: [] })
  return {
    id: uid('m_'),
    name: 'Main Menu',
    slug,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    views: 0,
    theme: { ...DEFAULT_THEME },
    categories: [blank('Starters', 'utensils'), blank('Main Courses', 'cloche'), blank('Desserts', 'cake'), blank('Drinks', 'drink')],
  }
}
