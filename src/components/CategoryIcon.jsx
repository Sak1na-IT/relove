import { Shirt, Footprints, ShoppingBag, Watch, Sofa, Smartphone, BookOpen, Baby, Bike, Gem, Ellipsis } from 'lucide-react'

const MAP = { Shirt, Footprints, ShoppingBag, Watch, Sofa, Smartphone, BookOpen, Baby, Bike, Gem, Ellipsis }

export default function CategoryIcon({ name, size = 24 }) {
  const Icon = MAP[name] || Ellipsis
  return <Icon size={size} strokeWidth={1.4} />
}
