
import AppRouter from "./src/routes/AppRouter";
import AuthContextComponent from "./src/context/AuthContext";


const App = () => {

  return (
      <AuthContextComponent>
          <AppRouter />
      </AuthContextComponent>
    
  );
};

export default App;
