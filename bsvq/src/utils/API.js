import axios from "axios";

export default {
//------------------------------ Data Api --------------------------------------
  findAll: function(){return axios.get("/api/data/findAll")},
  findOne: function(data){return axios.post("/api/data/findOne", data)},
  addFile: function(data){return axios.post("/api/data/addFile", data)},
  deleteFile: function(data){return axios.post("/api/data/deleteFile", data)}
  
}