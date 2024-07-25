import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import {  db } from "../../firebaseConfig";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";



const Dashboard = () => {
  const adminNuevos = import.meta.env.VITE_ADMINNUEVOS;
  const adminProspMiembros = import.meta.env.VITE_ADMINPROSPMIEMBROS;
  const [userSelected, setUserSelected] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newRol, setNewRol] = useState("");
  

  useEffect(() => {
    setIsChange(false);
    const dataFetch = async () => {
      try {
        let userCollection = collection(db, "users");
        const resUser = await getDocs(userCollection);
        let newRes = resUser.docs.map((user) => {
          return { ...user.data(), id: user.id };
        });
        setUsers(newRes);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    dataFetch();
  }, [isChange]);

  const handleChangeRol = async () => {
    
    try {
      const userCollection = collection(db, "users");
      const userEditado = {
        ...userSelected,
        rol: newRol === "adminNuevos" ? adminNuevos : newRol === "user" ? "user" : adminProspMiembros,
      };

      await updateDoc(doc(userCollection, userSelected.id), userEditado);
      setIsChange(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="containerTable">
      <TableContainer component={Paper}>
        <Table aria-label="simple table" >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontSize: "1.2rem", fontWeight: "bolder", textTransform: "uppercase" }}
              >
                Usuario
              </TableCell>
              
              <TableCell
                align="left"
                style={{ fontSize: "1.2rem", fontWeight: "bolder", textTransform: "uppercase" }}
              >
                Rol
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem", textTransform: "uppercase" }}
                >
                  {(`${user.nombre} ${user.apellido}`)}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem" }}
                  onClick={() => {
                    setUserSelected(user);
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  <select
                    value={loading ? "loading" : user.rol}
                    onChange={(e) => {setNewRol(e.target.value), setLoading(true)}}
                    onBlur={() => handleChangeRol()}
                    style={{ fontSize: "1.2rem", textTransform: "uppercase" }}
                  >
                        {loading & userSelected?.nombre === user?.nombre && <option>Loading...</option>} : 
                        
                          {user.rol === adminNuevos ?(
                            <>
                            <option value="adminNuevos">Admin nuevos</option>
                            <option value="user">User</option>
                            <option value="adminMiembros">Admin miembros</option>
                            </>
                          ) : user.rol === "user" ?
                            <>
                            <option value="user">User</option>
                            <option value="adminMiembros">Admin miembros</option>
                            <option value="adminNuevos">Admin nuevos</option>
                            </>
                           : 
                            <>
                            <option value="adminMiembros">Admin miembros</option>
                            <option value="user">User</option>
                            <option value="adminNuevos">Admin Nuevos</option>
                            </>
                          }
                        
                      
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;