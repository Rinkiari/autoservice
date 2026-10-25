import { useSelector } from 'react-redux'
import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'
import SearchForm from './components/SearchForm'

export default function App() {
  const selected = useSelector((state) => state.search.selected)

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Подбор автозапчастей и аналогов</h1>

      <div className="card mb-4">
        <div className="card-body">
          <SearchForm />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <h2 className="h5">1. Производитель</h2>
          <BrandList />
        </div>
        <div className="col-lg-8">
          <h2 className="h5">
            2. Аналоги и предложения
            {selected && (
              <span className="text-secondary fw-normal">
                {' '}
                — {selected.brand} {selected.number}
              </span>
            )}
          </h2>
          <OffersTable />
        </div>
      </div>
    </div>
  )
}
