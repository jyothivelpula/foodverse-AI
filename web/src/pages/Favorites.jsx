import FoodCard from '../components/food/FoodCard'
import { useStore } from '../store/useStore'

export default function Favorites() {
  const favorites = useStore((s) => s.favorites)
  const menuItems = useStore((s) => s.menuItems)
  const items = menuItems.filter((i) => favorites.includes(i.id))

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl font-semibold">Favorites</h1>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-border bg-white p-6 text-muted">
          No favorites yet. Heart dishes from the menu to save them here.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
