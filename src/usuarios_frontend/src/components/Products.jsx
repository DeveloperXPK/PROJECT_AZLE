import { useCanister, useConnect } from "@connect2ic/react";
import React, { useEffect, useState } from "react";
import Home from './Home'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Products = () => {
  
  const [usersBackend] = useCanister("usuarios_backend");
  const {principal} = useConnect();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [nombre_Producto, setNombre_Producto] = useState("");

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);

  const updateProduct = async () => {
    console.log('aui')
    const form = document.getElementById("formEditar")
    
    const nombre_Producto = form.nombre_Producto.value;
    const fabricante_Producto = form.fabricante_Producto.value;
    const precio_Producto = form.precio_Producto.value;

    setLoading("Loading...");

    await usersBackend.updateProduct(idProduct, nombre_Producto, fabricante_Producto, precio_Producto);
    setLoading("");
    setIdProduct("")

    setShowModalEditar(false);
    obtieneProductos();
  }


    
  const handleShowModalEditar = async (idProducto) => {
    setShowModalEditar(true);
    setIdProduct(idProduct)
    
    const producto = await usersBackend.readProductById(idProducto);

    const form = document.getElementById("formEditar")
    form.nombre_Producto.value = producto[0].nombre_Producto
    form.fabricante_Producto.value = producto[0].fabricante_Producto
    form.precio_Producto.value = producto[0].precio_Producto

  }

  const handleShowModalEliminar = async (idProducto, nombre_Producto) => {
    setShowModalEliminar(true);
    setNombre_Producto(nombre_Producto)
    setIdProduct(idProducto)
      

  }

  const handleCloseModalEditar = () => setShowModalEditar(false);
  const handleCloseModalEliminar = () => setShowModalEliminar(false);

  useEffect(() => {
      obtieneProductos();
  }, []);

 
  const obtieneProductos = async () => {
      setLoading("Loading...");
      try {
        var productsRes = await usersBackend.readProducts();
        setProducts(productsRes);   
        // usersRes.forEach((user, index) => {
        //   console.log("user" +user.nombre);
        // });   
        setLoading("");

      } catch(e) {
          console.log(e);
          setLoading("Error happened fetching products list");
      }

  }

  
  
  const deleteProduct = async (e) => {

    setLoading("Loading...");

    await usersBackend.deleteProduct(idProduct);
    setLoading("");
    setIdProduct("");
    setNombre_Producto("");
    setShowModalEliminar(false);
    
    obtieneProductos();
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
              Lista de productos
            </div>
            <div className="card-body">
                <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Fabricante</th>
                    <th>Precio</th>
                    <th colSpan="2">Opciones</th>
                  </tr>
                </thead>
                <tbody id="tbody">
                  {products.map((product) => {
                    return (
                      <tr key={product.idProduct}>
                        <td>{product.nombre_Producto}</td>
                        <td>{product.fabricante_Producto}</td>
                        <td>{product.precio_Producto}</td>
                        <td>
                          <button type="button" className="btn btn-primary" onClick={() => handleShowModalEditar(`${product.id}`)}>Editar</button>
                        </td>
                        <td>
                          <button type="button" className="btn btn-danger" onClick={() => handleShowModalEliminar(`${product.id}`,user.nombre)}>Eliminar</button>
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
            <Modal.Title>Actualizar producto</Modal.Title>
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
                      <label htmlFor="nombre_Producto" >Producto</label>
                      <input type="text" className="form-control" id="nombre_Producto" placeholder="Iphone 15 Pro Max" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="fabricante_Producto" >Fabricante</label>
                      <input type="text" className="form-control" id="fabricante_Producto" placeholder="Apple" />
                  </div>
                      <div className="form-group">
                      <label htmlFor="precio_Producto" >Precio</label>
                      <input type="text" className="form-control" id="precio_Producto" placeholder="1000$" />
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
            <Button variant="primary"  onClick={updateProduct}>
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
                <p> Deseas eliminar el siguiente producto: {nombre_Producto}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalEliminar}>
              Cerrar
            </Button>
            <Button variant="danger"  onClick={deleteProduct}>
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
  
  
export default Products