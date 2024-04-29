import { useCanister, useConnect } from "@connect2ic/react";
import React, { useEffect, useState } from "react";
import Home from './Home'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Users = () => {
  
  const [usersBackend] = useCanister("usuarios_backend");
  const {principal} = useConnect();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("");
  const [idUser, setIdUser] = useState("");
  const [nombre, setNombre] = useState("");

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);

  const updateUser = async () => {
    console.log('aui')
    const form = document.getElementById("formEditar")
    
    const nombre = form.nombre.value;
    const direccion = form.direccion.value;
    const telefono = form.telefono.value;

    setLoading("Loading...");

    await usersBackend.updateUser(idUser, nombre, direccion, telefono);
    setLoading("");
    setIdUser("")

    setShowModalEditar(false);
    obtieneUsuarios();
  }


    
  const handleShowModalEditar = async (idUsuario) => {
    setShowModalEditar(true);
    setIdUser(idUsuario)
    
    const usuario = await usersBackend.readUserById(idUsuario);

    const form = document.getElementById("formEditar")
    form.nombre.value = usuario[0].nombre
    form.direccion.value = usuario[0].direccion
    form.telefono.value = usuario[0].telefono

  }

  const handleShowModalEliminar = async (idUsuario, nombre) => {
    setShowModalEliminar(true);
    setNombre(nombre)
    setIdUser(idUsuario)
      

  }

  const handleCloseModalEditar = () => setShowModalEditar(false);
  const handleCloseModalEliminar = () => setShowModalEliminar(false);

  useEffect(() => {
      obtieneUsuarios();
  }, []);

 
  const obtieneUsuarios = async () => {
      setLoading("Loading...");
      try {
        var usersRes = await usersBackend.readUsers();
        setUsers(usersRes);   
        // usersRes.forEach((user, index) => {
        //   console.log("user" +user.nombre);
        // });   
        setLoading("");

      } catch(e) {
          console.log(e);
          setLoading("Error happened fetching users list");
      }

  }

  
  
  const deleteUser = async (e) => {

    setLoading("Loading...");

    await usersBackend.deleteUser(idUser);
    setLoading("");
    setIdUser("");
    setNombre("");
    setShowModalEliminar(false);
    
    obtieneUsuarios();
  }
  
 
  return(
    <>
    { principal 
      ? 
      <div className="row  mt-5">
        <div className="col">
          {loading != "" 
            ? 
              <div className="alert alert-primary">{loading}</div>
            :
              <div></div>
          }
          <div className="card">
            <div className="card-header">
              Lista de usuarios
            </div>
            <div className="card-body">
                <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Direccion</th>
                    <th>Telefono</th>
                    <th colSpan="2">Opciones</th>
                  </tr>
                </thead>
                <tbody id="tbody">
                  {users.map((user) => {
                    return (
                      <tr key={user.id}>
                        <td>{user.nombre}</td>
                        <td>{user.direccion}</td>
                        <td>{user.telefono}</td>
                        <td>
                          <button type="button" className="btn btn-primary" onClick={() => handleShowModalEditar(`${user.id}`)}>Editar</button>
                        </td>
                        <td>
                          <button type="button" className="btn btn-danger" onClick={() => handleShowModalEliminar(`${user.id}`,user.nombre)}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>         
            </div>
          </div>
        </div>

        <Modal show={showModalEditar} onHide={handleCloseModalEditar}>
          <Modal.Header closeButton>
            <Modal.Title>Actualizar usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card">
              <div className="card-body">
                {loading != "" 
                  ? 
                  <div className="alert alert-primary">{loading}</div>
                  :
                  <div></div>
                }
                <form style={{display:"inline"}} id="formEditar" >
                  <div className="form-group">
                      <label htmlFor="nombre" >Nombre usuario</label>
                      <input type="text" className="form-control" id="nombre" placeholder="Homero" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="direccion" >Direccion</label>
                      <input type="text" className="form-control" id="direccion" placeholder="Calle siempre viva" />
                  </div>
                      <div className="form-group">
                      <label htmlFor="telefono" >Telefono</label>
                      <input type="text" className="form-control" id="telefono" placeholder="123" />
                  </div>
                  <br />
                </form>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalEditar}>
              Cerrar
            </Button>
            <Button variant="primary"  onClick={updateUser}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalEliminar} onHide={handleCloseModalEliminar}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card">
              <div className="card-body">
                {loading != "" 
                  ? 
                  <div className="alert alert-primary">{loading}</div>
                  :
                  <div></div>
                }
                <p> Deseas eliminar el usuario con nombre {nombre}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalEliminar}>
              Cerrar
            </Button>
            <Button variant="danger"  onClick={deleteUser}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    : 
      <Home />
    }
    </>
  )
}
  
  
export default Users