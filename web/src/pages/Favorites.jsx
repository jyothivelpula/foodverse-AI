import { useNavigate } from 'react-router-dom'
import FoodCard from '../components/food/FoodCard'
import { useStore } from '../store/useStore'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'

export default function Favorites() {
  const navigate = useNavigate()
  const favorites = useStore((s) => s.favorites)
  const menuItems = useStore((s) => s.menuItems)
  const items = menuItems.filter((i) => favorites.includes(i.id))

  return (
    <PageShell className="space-y-6">
      <h1 className="font-serif text-4xl font-semibold">Favorites</h1>
      {items.length === 0 ? (
        <EmptyState
          illustration="favorites"
          title="No favorites yet"
          hint="Heart dishes from the menu to save them here."
          actionLabel="Browse Menu"
          action={() => navigate('/menu')}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
