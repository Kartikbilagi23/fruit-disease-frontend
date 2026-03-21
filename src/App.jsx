import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
const BASE_URL = "https://fruit-disease-backend.onrender.com";

const App = () => {
  const [image, setimage] = useState(null);
  const [preview, setpreview] = useState(null);
  const [result, setresult] = useState(null);
  const [history, sethistory] = useState([])
  const [fruit, setfruit] = useState("apple")


  useEffect(() => {
    fetchhistory()
  }, [])

  const fetchhistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/history`);
      sethistory(res.data);
    } catch (error) {
      console.log(error)
    }
  }
  const handleimagechange = (e) => {
    const file = e.target.files[0];
    setimage(file);
    setpreview(URL.createObjectURL(file))
  }
  const handleuploads = async () => {
    if (!image) {
      return alert("Select an Image!")
    }
    const formData = new FormData();
    formData.append("image", image)
    formData.append("fruit",fruit)
    try {
      const res = await axios.post(
        `${BASE_URL}/upload`,
        formData
      );
      setresult(res.data.infected_area);
    } catch (error) {
      console.log(error)
    }
  }
  const getstatus = (value) => {
    if (value < 10) return { text: "Healthy 🟢", color: "green" };
    if (value < 30) return { text: "Mild Disease 🟡", color: "yellow" };
    return { text: "Severe Disease 🔴", color: "red" };

  }
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🍎 Fruit Disease Detection</h1>
      <input type="file" onChange={handleimagechange} />
      <br /><br />
      {preview && (
        <img src={preview} alt='preview' style={{ width: "200px", borderRadius: "10px" }} />
      )}
      <button onClick={handleuploads}>
        Detect Disease
      </button>
      <select onChange={(e)=>setfruit(e.target.value)}
        style={{padding:"6px", borderRadius:"12px", marginLeft:"15px",
        paddingLeft:"25px"
        }}
        >
        <option value="apple">Apple 🍎</option>
        <option value="banana">Banana 🍌</option>
        <option value="tomato">Tomato 🍅</option>
      </select>
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Infected Area:{result.toFixed(2)}%</h2>
          <h3 style={{ color: getstatus(result).color }}>
            {getstatus(result).text}
          </h3>
        </div>
      )}
      <h2 style={{ marginTop: "40px" }}>History</h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px"
      }
      }>
        {history.map((item, index) => {
          const status = getstatus(item.infected_area);
          return (
            <div
              key={index}
              style={{
                width: "200px",
                padding: "15px",
                borderRadius: "10px",
                backgroundColor:
                  status.color === "green"
                    ? "#e6ffe6"
                    : status.color === "orange"
                      ? "#fff4e6"
                      : "#ffe6e6",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center"
              }}
            >
              
              <img src={`${BASE_URL}/uploads/${item.image.split("\\").pop()}`} 
              alt="fruit"
              style={{width:"100%",borderRadius:"8px"}}
              />
              <h3 style={{ color: status.color }}>
                {status.text}
              </h3>
              <p><b>{item.infected_area.toFixed(2)}%</b></p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <button
              onClick={async () => {
                await axios.delete(`http://${BASE_URL}/delete/${item._id}`);
                fetchhistory()
              }}
              style={{
                marginTop:"10px",
                padding:"5px 10px",
                color:"white",
                border:"none",
                background:"black",
                borderRadius:"5px",
                cursor:"pointer"
              }}
              >Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App;