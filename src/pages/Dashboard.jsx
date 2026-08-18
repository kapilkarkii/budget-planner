import { useSelector } from 'react-redux'

export const Dashboard = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  console.log(transactions)
  return <h1>Dashboard</h1>
}