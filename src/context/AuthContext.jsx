import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {
  const [user, setUser] = useState( JSON.parse(localStorage.getItem("userInfo")) || {});
  const [isLogged, setIsLogged] = useState( JSON.parse(localStorage.getItem("isLogged")) || false);
  const style = {
    display: "flex",
    gap: "4px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    "@media (min-width: 768px)": {
      width: "60%",
    },
  };

  const handleLogin = (userLogged) => {
    setUser(userLogged);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(userLogged))
    localStorage.setItem("isLogged", JSON.stringify(true))
    setTimeout(() => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isLogged");
    }, 4 * 60 * 60 * 1000);
  };

  const logoutContext = () => {
    setUser({});
    setIsLogged(false);
    localStorage.removeItem("userInfo")
    localStorage.removeItem("isLogged")
  };

  let data = {
    user,
    isLogged,
    handleLogin,
    logoutContext,
    style,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextComponent;