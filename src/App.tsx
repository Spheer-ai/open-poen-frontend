import AppRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider as AppAuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AppAuthProvider>
        <div>
          <AppRoutes />
        </div>
      </AppAuthProvider>
    </Router>
  );
}

export default App;
