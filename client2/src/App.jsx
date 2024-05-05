import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import {v4 as uuidv4} from "uuid";

function App() {
  const [formInputs, setFormInputs] = useState({});
  const [crudData, setCrudData] = useState([]);
  const [isEdit,setIsEdit] = useState(false);
  const socket = io("localhost:3000");
  const handleInput = (event) => {
    const { name, value } = event.target;

    let obj = { [name]: value };

    setFormInputs((prev) => ({ ...prev, ...obj }));
  };

  const handleSubmit = (e) => {
    socket.emit("data",{...formInputs,id: uuidv4()});

    socket.on("crudData", (response) => {
      setCrudData(response);
    });

    setFormInputs({
      name: "",
      age: "",
      phone: "",
    });

  };

  const getEditData = (data) => {
    setFormInputs(data)
    setIsEdit(true)
  }

  const handleEdit = () => {
  
    socket.emit('editData',formInputs);

    setIsEdit(false);

    setFormInputs({
      name: "",
      age: "",
      phone: "",
    });
  }

  const handleDelete = (id) => {
    socket.emit('deleteData',id)
  }

  useEffect(() => {
    socket.on("crudData", (response) => {
      setCrudData(response);
    });
  }, []);

  return (
    <>
      <h1>CRUD Operations</h1>

      <div className="form-fields">
        <input
          onChange={handleInput}
          className="input-field"
          name="name"
          value={formInputs.name}
          placeholder="Enter your Name"
        />
        <input
          onChange={handleInput}
          className="input-field"
          name="age"
          value={formInputs.age}
          placeholder="Enter your Age"
        />
        <input
          onChange={handleInput}
          className="input-field"
          name="phone"
          value={formInputs.phone}
          placeholder="Enter your Phone Number"
        />

        <button onClick={isEdit ? handleEdit : handleSubmit}>{isEdit? 'Edit' : 'Add'} Data</button>

        {crudData.length > 0 ? (
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Phone Number</th>
                <th></th>
                <th></th>
              </tr>

              {crudData.map(
                (
                  data // Please don't do mistake like me near map. Put () instead of {}
                ) => (
                  <tr>
                    <td>{data.name}</td>
                    <td>{data?.age}</td>
                    <td>{data?.phone}</td>
                    <td>
                      <button onClick={() => getEditData(data)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(data?.id)}>Delete</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
