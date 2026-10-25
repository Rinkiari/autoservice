import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBrands, fetchOffers } from '../api/partsApi'

export const searchBrands = createAsyncThunk('search/brands', (number, { signal }) =>
  fetchBrands(number, signal),
)

export const searchOffers = createAsyncThunk('search/offers', ({ number, brand }, { signal }) =>
  fetchOffers(number, brand, signal),
)

const emptyRequest = { items: [], status: 'idle', error: null, requestId: null }

const initialState = {
  number: '',
  brands: emptyRequest,
  selected: null,
  offers: emptyRequest,
}

const isCurrent = (request, action) => request.requestId === action.meta.requestId

const startRequest = (action) => ({ ...emptyRequest, status: 'loading', requestId: action.meta.requestId })

function finishRequest(request, action) {
  if (!isCurrent(request, action)) return
  request.status = 'succeeded'
  request.items = action.payload
}

function failRequest(request, action) {
  if (!isCurrent(request, action)) return
  request.status = 'failed'
  request.error = action.error.message
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.brands = startRequest(action)
        state.selected = null
        state.offers = emptyRequest
      })
      .addCase(searchBrands.fulfilled, (state, action) => finishRequest(state.brands, action))
      .addCase(searchBrands.rejected, (state, action) => failRequest(state.brands, action))
      .addCase(searchOffers.pending, (state, action) => {
        state.selected = action.meta.arg
        state.offers = startRequest(action)
      })
      .addCase(searchOffers.fulfilled, (state, action) => finishRequest(state.offers, action))
      .addCase(searchOffers.rejected, (state, action) => failRequest(state.offers, action))
  },
})

export const { resetSearch } = searchSlice.actions
export default searchSlice.reducer
