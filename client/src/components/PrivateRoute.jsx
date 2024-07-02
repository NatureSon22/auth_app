import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
  const { currentUser } = useSelector(state => state.user)

  // if the user is not logged in, redirect to the signin page else render the Profile page
  return (
    currentUser ? <Outlet /> : <Navigate to="/signin" />
  )
}

export default PrivateRoute