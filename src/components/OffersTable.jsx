import { useDispatch, useSelector } from 'react-redux'
import { searchOffers } from '../store/searchSlice'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })
const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export default function OffersTable() {
  const dispatch = useDispatch()
  const { selected, offers } = useSelector((state) => state.search)

  if (!selected) {
    return <p className="text-secondary">Выберите производителя, чтобы увидеть аналоги и предложения.</p>
  }
  if (offers.status === 'loading') {
    return <Loader text="Загружаем аналоги и предложения…" />
  }
  if (offers.status === 'failed') {
    return <ErrorAlert message={offers.error} onRetry={() => dispatch(searchOffers(selected))} />
  }
  if (offers.items.length === 0) {
    return <div className="alert alert-warning">Предложений не найдено.</div>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Деталь</th>
            <th>Склад</th>
            <th>Отгрузка</th>
            <th className="text-end">Остаток</th>
            <th className="text-end">Цена</th>
          </tr>
        </thead>
        <tbody>
          {offers.items.map((offer) => {
            const inStock = offer.stock > 0
            return (
              <tr key={offer.id} className={inStock ? '' : 'text-secondary'}>
                <td>
                  <div>
                    <span className="fw-semibold">{offer.brand}</span>{' '}
                    <span className="font-monospace">{offer.number}</span>{' '}
                    {offer.isAnalogue ? (
                      <span className="badge text-bg-secondary">аналог</span>
                    ) : (
                      <span className="badge text-bg-primary">искомая</span>
                    )}
                  </div>
                  <small className="text-secondary">{offer.name}</small>
                </td>
                <td className="text-nowrap">{offer.warehouse ?? '—'}</td>
                <td>{offer.shipmentDate ? dateFormat.format(new Date(offer.shipmentDate)) : '—'}</td>
                <td className="text-end text-nowrap">
                  {inStock ? `${offer.stock} шт.` : <span className="badge text-bg-light">нет в наличии</span>}
                </td>
                <td className="text-end text-nowrap fw-semibold">
                  {offer.price != null ? priceFormat.format(offer.price) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
