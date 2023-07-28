const express =  require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000; // to start the the server on port 5000

const MONGODB_URL = "mongodb://127.0.0.1:27017/scholarshipDB";

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then( () => console.log("Connection Successfull")).catch( (err) => console.log(err));

const NationalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gender: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  educationLvl: [String],
  caste: [String],
  pwd: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true}
});

const InternationalSchema = new mongoose.Schema({
  ititle: { type: String, required: true },
  icountry: { type: String, required: true },
  ieducationLvl: [String],
  idescription: { type: String, required: true },
  iwebsite: { type: String, required: true },
})

const National = mongoose.model("National", NationalSchema);
const International = mongoose.model("International", InternationalSchema);

app.use(cors());
app.use(bodyParser.json());

app.get("/api/nationals", async (req, res) =>{
  const { query, gender, fieldOfStudy, educationLvl, caste, pwd} = req.query;


  const filterObject = {};
  if(query) {
    filterObject.title = { $regex: new RegExp(query, 'i')};
  }
  if(gender) {
    filterObject.gender = { $regex: new RegExp(gender, 'i')};
  }
  if(fieldOfStudy) {
    filterObject.fieldOfStudy = { $regex: new RegExp(fieldOfStudy, 'i')};
  }
  if(educationLvl) {
    filterObject.educationLvl = { $in: educationLvl};
  }
  if(caste) {
    filterObject.caste = { $in: caste};
  }
  if(pwd) {
    console.log(filterObject.pwd);
    filterObject.pwd = { $regex: new RegExp(pwd, 'i')}
  }

  try {
    const nationals = await National.find(filterObject).exec();
    res.json(nationals);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch data"});
  }

});

app.get("/api/internationals", async (req, res) =>{
  const { iquery, icountry, ieducationLvl} = req.query;
  const filterObject = {};
  if(iquery) {
    filterObject.ititle = { $regex: new RegExp(iquery, 'i')};
  }
  if(icountry) {
    filterObject.icountry = { $regex: new RegExp(icountry, 'i')};
  }

  if(ieducationLvl) {
    filterObject.ieducationLvl = { $in: ieducationLvl};
  }

  try {
    const internationals = await International.find(filterObject).exec();
    res.json(internationals);    
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch data"});
  }

});

app.listen(PORT, () =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});