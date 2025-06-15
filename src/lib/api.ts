import axios from 'axios'

export const getExpenses = async (month: number, year: number) => {
  const res = await axios.get(`/api/expenses?month=${month}&year=${year}`)
  return res.data
}

export const updateExpenses = async (date: string, expenses: unknown[]) => {
  const res = await axios.post('/api/expenses', { date, expenses })
  return res.data
}