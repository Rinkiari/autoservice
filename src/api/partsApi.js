const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

const ERROR_MESSAGES = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов',
}

function translateError(error) {
  const text = String(error)
  return Object.entries(ERROR_MESSAGES).reduce(
    (result, [original, translated]) => result.replace(original, translated),
    text,
  )
}

async function request(params, signal) {
  const query = new URLSearchParams({ key: API_KEY, ...params })

  let response
  try {
    response = await fetch(`${API_URL}?${query}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`Сервер вернул некорректный ответ (HTTP ${response.status})`)
  }

  if (data.error) throw new Error(translateError(data.error))
  if (!response.ok) throw new Error(`Ошибка сервера (HTTP ${response.status})`)

  return (data.goods ?? []).filter((item) => item.brand || item.number)
}

export async function fetchBrands(number, signal) {
  const goods = await request({ number }, signal)
  const unique = new Map()
  for (const item of goods) {
    const key = `${item.brand}|${item.number}`
    if (!unique.has(key)) {
      unique.set(key, { brand: item.brand, number: item.number, name: item.name, count: item.count })
    }
  }
  return [...unique.values()]
}

export async function fetchOffers(number, brand, signal) {
  const goods = await request({ number, brand, analogues: 'on' }, signal)
  const offers = []

  const addOffers = (item, isAnalogue) => {
    const part = {
      isAnalogue,
      brand: item.brand,
      number: item.number,
      name: item.name,
    }
    if (!item.warehouses?.length) {
      offers.push({ ...part, id: item.goodsID, warehouse: null, price: null, stock: 0, shipmentDate: null })
      return
    }
    for (const warehouse of item.warehouses) {
      offers.push({
        ...part,
        id: `${item.goodsID}|${warehouse.id}`,
        warehouse: warehouse.code || (warehouse.own ? 'Свой склад' : 'Склад поставщика'),
        price: warehouse.price,
        stock: warehouse.stock,
        shipmentDate: warehouse.shipmentDate,
      })
    }
  }

  for (const item of goods) {
    addOffers(item, false)
    for (const analogue of item.analogues ?? []) addOffers(analogue, true)
  }

  return offers.sort(
    (a, b) =>
      a.isAnalogue - b.isAnalogue ||
      (b.stock > 0) - (a.stock > 0) ||
      (a.price ?? 0) - (b.price ?? 0),
  )
}
