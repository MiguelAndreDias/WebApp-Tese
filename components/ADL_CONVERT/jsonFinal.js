import { createHeader } from "./Header.js"
import { createConcept } from "./Concept.js"
import { createLanguage } from "./Language.js"
import { createDescription } from "./Description.js"
import { createOntology } from "./Ontology.js"
import { createAllMatches } from "./Definition.js"

//Needed to have both import and requires in the same file
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');
import fetch, { Headers } from 'node-fetch';

//read data file and put into a string

//let filename = "openEHR-EHR-CLUSTER.waveform.v0.adl.txt"




//Abrir ficheiros por fetch request


/* const url = "https://api.github.com/"
const getRepoContent = "repos/gestaopedidosehr/CKM-mirror/contents/"
const path = "local/archetypes/cluster/openEHR-EHR-CLUSTER.waveform.v0.adl"



await fetch(url + getRepoContent + path , {
headers: new Headers({
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'Bearer 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',
    
    })
}).then(res => res.json()).then(json => {
  filename = json.content
  console.log(filename)
  filename = convert64(filename)

  
  


}) */












export function createJson(dataFile) {




  let Header = createHeader(dataFile)
  let Concept = createConcept(dataFile)
  let Language = createLanguage(dataFile)
  let Description = createDescription(dataFile)
  let objDefinitionInicial = createAllMatches(dataFile)
  let Ontology = createOntology(dataFile)



  let objHeader = JSON.parse(Header)
  let objConcept = JSON.parse(Concept)
  let objLanguage = JSON.parse(Language)
  let objDescription = JSON.parse(Description)
  let objOntology = JSON.parse(Ontology)


  let objDefinitionFinal = { "definition": {} }
  objDefinitionFinal.definition = objDefinitionInicial


  const mergedObject = {
    ...objHeader,
    ...objConcept,
    ...objLanguage,
    ...objDescription,
    ...objDefinitionFinal,
    ...objOntology

  };


  return mergedObject

}



