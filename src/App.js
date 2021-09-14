import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logo from './imgs/logo_pizza.png'

function App() {
  const baseURL = "https://localhost:44382/api/pedidos";
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState({
    id: '2',
    masa: '',
    tamaño: '',
    ingredientes: [],
    //listaIngredientes: 'Jamon, Piña',
    precio: 99,
  })

  const enabled = pedidoSeleccionado.masa.length > 0
    && pedidoSeleccionado.tamaño.length > 0
    && pedidoSeleccionado.ingredientes.length > 0;

  //Llena lista de Masa y Tamaño
  const handleChangeRB = e => {
    const { name, value } = e.target;
    setPedidoSeleccionado({ ...pedidoSeleccionado, [name]: value });
  }

  //Llena lista de ingredientes
  const handleChangeCB = e => {
    const { value, checked } = e.target;
    console.log(value + ":" + checked)

    var ingredientes = [...pedidoSeleccionado.ingredientes];

    if (checked) {
      console.log("add element")
      ingredientes.push(value);
    }
    else {
      console.log("quit element")
      var index = ingredientes.findIndex((element) => element === value);
      ingredientes.splice(index, 1);
      console.log(ingredientes);
    }
    setPedidoSeleccionado({ ...pedidoSeleccionado, ingredientes: ingredientes });
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsert(!modalInsert);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const peticionGet = async () => {
    await axios.get(baseURL)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    console.log("post method");
    console.log(pedidoSeleccionado);

    await axios.post(baseURL, pedidoSeleccionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
        const rand = Math.trunc(2 + Math.random() * (10000 - 2));
        setPedidoSeleccionado({
          id: rand,
          masa: '',
          tamaño: '',
          ingredientes: [],
          precio: 100,
        })
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    console.log(pedidoSeleccionado.id)
    await axios.delete(baseURL + "/" + pedidoSeleccionado.id)
      .then(response => {
        setData(data.filter(pedido => pedido.id !== pedidoSeleccionado.id));
        abrirCerrarModalEliminar();
        const rand = Math.trunc(2 + Math.random() * (10000 - 2));
        setPedidoSeleccionado({
          id: rand,
          masa: '',
          tamaño: '',
          ingredientes: [],
          precio: 101,
        })
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    abrirCerrarModalEliminar();
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="App">
      <nav className="navbar-dark bg-primary">
        <a className="navbar-brand" href="#">
          <img src={logo} width="50" height="50" alt="Pizza" />
        </a>
        <button onClick={() => abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo pedido</button>
      </nav>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Masa</th>
            <th>Tamaño</th>
            <th>Ingredientes</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pedido, i) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.masa}</td>
              <td>{pedido.tamaño}</td>
              <td>{pedido.ingredientes.toString()}</td>
              <td>{Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(pedido.precio)}</td>

              <td>
                <button className="btn btn-danger" onClick={() => seleccionarPedido(pedido)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsert}>
        <ModalHeader>Agrega una nueva pizza a tu pedido</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <h6>Masa:</h6>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="masa" value="Original" id="MasaOriginal" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="MasaOriginal"> Original </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="masa" value="Sarten" id="MasaSarten" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="MasaSarten"> Sartén </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="masa" value="Orilla de queso" id="MasaOrilla" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="MasaOrilla"> Orilla de queso </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="masa" value="Crunchy" id="MasaCrunchy" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="MasaCrunchy"> Crunchy </label>
            </div>
          </div>

          <br />

          <div className="form-group">
            <h6>Tamaño:</h6>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tamaño" value="Individual" id="TamañoIndividual" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="TamañoIndividual"> Individual </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tamaño" value="Mediana" id="TamañoMediana" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="TamañoMediana"> Mediana </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tamaño" value="Grande" id="TamañoGrande" onChange={handleChangeRB} />
              <label className="form-check-label" htmlFor="TamañoGrande"> Grande </label>
            </div>
          </div>

          <br />

          <div className="form-group">
            <label>Ingredientes:</label>
            <br />
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Peperoni" id="Peperoni" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Peperoni"> Peperoni </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Jamon" id="Jamon" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Jamon"> Jamon </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Piña" id="Piña" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Piña"> Piña </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Cebolla" id="Cebolla" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Cebolla"> Cebolla </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Carne" id="Carne" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Carne"> Carne </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="ingredientes" value="Champiñones" id="Champiñones" onChange={handleChangeCB} />
              <label className="form-check-label" htmlFor="Champiñones"> Champiñones </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" disabled={!enabled} onClick={() => peticionPost()} >Insertar</button>
          <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar} >
        <ModalBody>
          ¿Estas seguro de que deseas eliminar el pedido {pedidoSeleccionado && pedidoSeleccionado.id}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}> Sí </button>
          <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}> No </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
