export type Category = {
  id: string
  name: string
  tagline: string
  accent: string
  gradient: string
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  condition: 'New' | 'Like new' | 'Good' | 'Fair'
  seller: string
  campusPickup: string
  image: string
  gradient: string
  tags?: {
    urgentSale?: boolean
    newItem?: boolean
  }
}

export const categories: Category[] = [
  {
    id: 'books',
    name: 'Books',
    tagline: 'Textbooks, notes, references',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(34,211,238,0.12))',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    tagline: 'Laptops, headphones, accessories',
    accent: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(59,130,246,0.12))',
  },
  {
    id: 'hostel',
    name: 'Hostel',
    tagline: 'Essentials for dorm life',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.22), rgba(168,85,247,0.10))',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Clubs, study, daily carry',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.20), rgba(99,102,241,0.12))',
  },
]

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Calculus Vol. 1 (Used)',
    description: 'Marks-free pages. Includes practice set solutions.',
    price: 399,
    categoryId: 'books',
    condition: 'Good',
    seller: 'Aarav',
    campusPickup: 'Library Block',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(34,211,238,0.12))',
    tags: { urgentSale: true },
  },
  {
    id: 'p2',
    title: 'DBMS Quick Notes',
    description: 'Bite-sized revision notes + ER diagrams.',
    price: 149,
    categoryId: 'books',
    condition: 'Like new',
    seller: 'Meera',
    campusPickup: 'Cafeteria Gate',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(34,211,238,0.28), rgba(139,92,246,0.14))',
    tags: { newItem: true },
  },
  {
    id: 'p3',
    title: 'Python for Beginners (2nd Ed.)',
    description: 'Perfect for freshers. Covers core syntax + projects.',
    price: 299,
    categoryId: 'books',
    condition: 'Good',
    seller: 'Rohan',
    campusPickup: 'Student Center',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(34,211,238,0.12))',
  },
  {
    id: 'p4',
    title: 'Noise-Canceling Headphones',
    description: 'Comfort fit, great for study sessions in hostel.',
    price: 999,
    categoryId: 'electronics',
    condition: 'Like new',
    seller: 'Zoya',
    campusPickup: 'Tech Lab',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.26), rgba(59,130,246,0.14))',
    tags: { urgentSale: true },
  },
  {
    id: 'p5',
    title: 'Wireless Mouse (Silent Click)',
    description: 'Ergonomic design. Smooth scrolling. USB dongle included.',
    price: 249,
    categoryId: 'electronics',
    condition: 'New',
    seller: 'Kabir',
    campusPickup: 'Main Hostel Lobby',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.28), rgba(34,197,94,0.12))',
    tags: { newItem: true },
  },
  {
    id: 'p6',
    title: 'USB-C Charger (65W)',
    description: 'Fast charging for laptops and phones.',
    price: 499,
    categoryId: 'electronics',
    condition: 'Good',
    seller: 'Nisha',
    campusPickup: 'Library Block',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(168,85,247,0.12))',
  },
  {
    id: 'p7',
    title: 'Bedside Study Lamp',
    description: 'Warm light mode, adjustable angle, low power.',
    price: 199,
    categoryId: 'hostel',
    condition: 'Good',
    seller: 'Samar',
    campusPickup: 'Hostel Block A',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.26), rgba(168,85,247,0.10))',
    tags: { newItem: true },
  },
  {
    id: 'p8',
    title: 'Compact Storage Organizer',
    description: 'Keep cables, snacks, and stationery neatly sorted.',
    price: 179,
    categoryId: 'hostel',
    condition: 'Like new',
    seller: 'Ishaan',
    campusPickup: 'Student Center',
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(249,115,22,0.14))',
  },
  {
    id: 'p9',
    title: 'Electric Kettle (1.2L)',
    description: 'Quick boil, automatic shutoff, easy to clean.',
    price: 599,
    categoryId: 'hostel',
    condition: 'Fair',
    seller: 'Ananya',
    campusPickup: 'Main Hostel Lobby',
    image: 'https://images.unsplash.com/photo-1563302111-eab4c7d3f373?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.22), rgba(59,130,246,0.10))',
    tags: { urgentSale: true },
  },
  {
    id: 'p10',
    title: 'College Tote Bag (Durable Canvas)',
    description: 'Fits a laptop + notebooks. Club-styled print.',
    price: 219,
    categoryId: 'accessories',
    condition: 'New',
    seller: 'Tara',
    campusPickup: 'Campus Gate',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.22), rgba(99,102,241,0.12))',
    tags: { newItem: true },
  },
  {
    id: 'p11',
    title: 'Study Desk Mat',
    description: 'Non-slip base, smooth surface, wipes clean.',
    price: 129,
    categoryId: 'accessories',
    condition: 'Good',
    seller: 'Dev',
    campusPickup: 'Tech Lab',
    image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.20), rgba(6,182,212,0.12))',
  },
  {
    id: 'p12',
    title: 'Campus Pass Card Holder',
    description: 'Holds ID + metro pass. Minimal and strong.',
    price: 99,
    categoryId: 'accessories',
    condition: 'Like new',
    seller: 'Prisha',
    campusPickup: 'Library Block',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.10))',
  },
  // Extra variety for nicer animations on filter
  {
    id: 'p13',
    title: 'DSA Problem Set (Volume 2)',
    description: 'Contains 250+ curated questions + difficulty tags.',
    price: 259,
    categoryId: 'books',
    condition: 'Like new',
    seller: 'Harsh',
    campusPickup: 'Cafeteria Gate',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.10))',
  },
  {
    id: 'p14',
    title: 'Bluetooth Speaker (Bass Boost)',
    description: 'Great sound for hostel parties. 10-hour battery.',
    price: 749,
    categoryId: 'electronics',
    condition: 'Good',
    seller: 'Farhan',
    campusPickup: 'Main Hostel Lobby',
    image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.26), rgba(34,197,94,0.12))',
    tags: { urgentSale: true },
  },
  {
    id: 'p15',
    title: 'Mini Fan (USB Powered)',
    description: 'Quiet, powerful airflow. Ideal for summer internships.',
    price: 179,
    categoryId: 'hostel',
    condition: 'New',
    seller: 'Kavya',
    campusPickup: 'Hostel Block A',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.20), rgba(6,182,212,0.10))',
  },
  {
    id: 'p16',
    title: 'Cable Organizer Kit',
    description: 'Velcro straps + labels to keep everything tangle-free.',
    price: 109,
    categoryId: 'accessories',
    condition: 'Good',
    seller: 'Simran',
    campusPickup: 'Student Center',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(168,85,247,0.10))',
  },
]

export function formatINR(price: number) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)
  } catch {
    return `₹${price}`
  }
}

export function getCategoryById(categoryId: string) {
  return categories.find((c) => c.id === categoryId) ?? null
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId)
}

