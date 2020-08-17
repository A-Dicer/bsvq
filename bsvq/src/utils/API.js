import axios from "axios";

export default {
//------------------------------ Data Api --------------------------------------
  
  slideAmt: function(data){return axios.post("/api/data/slideAmt", data)},
  
}