import { useDispatch, useSelector } from 'react-redux'
import { searchBrands, searchOffers } from '../store/searchSlice'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

export default function BrandList() {
  const dispatch = useDispatch()
  const { number, brands, selected } = useSelector((state) => state.search)

  if (brands.status === 'idle') {
    return <p className="text-secondary">Введите артикул, чтобы увидеть производителей.</p>
  }
  if (brands.status === 'loading') {
    return <Loader text="Ищем производителей…" />
  }
  if (brands.status === 'failed') {
    return <ErrorAlert message={brands.error} onRetry={() => dispatch(searchBrands(number))} />
  }
  if (brands.items.length === 0) {
    return <div className="alert alert-warning">По артикулу «{number}» ничего не найдено.</div>
  }

  return (
    <div className="list-group">
      {brands.items.map((item) => {
        const isActive = selected?.brand === item.brand && selected?.number === item.number
        return (
          <button
            key={`${item.brand}|${item.number}`}
            type="button"
            className={`list-group-item list-group-item-action${isActive ? ' active' : ''}`}
            aria-current={isActive}
            onClick={() => dispatch(searchOffers({ number: item.number, brand: item.brand }))}
          >
            <div className="d-flex justify-content-between align-items-baseline gap-2">
              <span className="fw-semibold">{item.brand}</span>
              <small className="font-monospace">{item.number}</small>
            </div>
            <small className={isActive ? '' : 'text-secondary'}>{item.name}</small>
          </button>
        )
      })}
    </div>
  )
}
