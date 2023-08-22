////////////////
//ONTOLOGY MATCH
////////////////

import { matchData } from './extraFunctions.js'


//Needed to have both import and requires in the same file
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');

export function createOntology(dataFile) {

  //Resolver bug com o SNOMED no terminalogies available

  dataFile = dataFile.replace('<"SNOMED-CT", ...>', '<"SNOMED-CT">')
  dataFile = dataFile.replaceAll("<[", '"')
  dataFile = dataFile.replaceAll("]>", '"')

  //Resolução do bug com comentarios (remove os comentarios)

  dataFile = dataFile.replaceAll(/comment = <.+>/g, '') //remove os comentarios formatados
  dataFile = dataFile.replaceAll(/comment = <.+[^>]+>/g, '') //remove os comentarios mal formatados



  //Resolução do bug em que certos ficheiros têm o "> numa linha diferente
  let regexErro = /description = <".+[\s]+">/g
  let matchErro = dataFile.match(regexErro)
  //console.log(matchErro)
  if (matchErro) {

    for (let i = 0; i < matchErro.length; i++) {
      //console.log(matchErro[i])
      let matchResolvido = matchErro[i]
      matchResolvido = matchResolvido.replaceAll(/[\r\n\t]/g, '')
      //console.log(matchResolvido)
      dataFile = dataFile.replace(matchErro[i], matchResolvido)
    }

  }

  let resultadoOntology = matchData(/ontology[\w\W]*>/, null, dataFile, "ontology")
  const ontologyProps = ['term_definitions :', 'items :', 'text :', 'description :', 'copyright :', 'comment :', 'terminologies_available :']

  for (let i = 0; i < ontologyProps.length; i++) {
    resultadoOntology = resultadoOntology.replaceAll(ontologyProps[i], '"' + ontologyProps[i].slice(0, -2) + '"' + ' :')
  }

  resultadoOntology = resultadoOntology.replace("ontology", '{' + '"ontology"' + ':' + '{')

  //VIRGULA
  let regexV = /".*?" : ".*?"/g
  let matchVirgula = resultadoOntology.match(regexV)
  let uniqMatch = [...new Set(matchVirgula)]

  for (let i = 0; i < uniqMatch.length; i++) {
    resultadoOntology = resultadoOntology.replaceAll(uniqMatch[i], uniqMatch[i] + ",")
  }

  //Tirar virgula no ultimo termo
  let regexOnto = /,\s+}/g

  let matchOnto = resultadoOntology.match(regexOnto)


  if (matchOnto == null) {
    resultadoOntology = resultadoOntology.replace('",', '"')
  }
  else {
    for (let i = 0; i < matchOnto.length; i++) {

      resultadoOntology = resultadoOntology.replace(matchOnto[i], '}')
    }
  }

  //Por virgula antes de certos termos
  let regexOnto2 = /}\s+"/g
  let matchOnto2 = resultadoOntology.match(regexOnto2)

  if (matchOnto2 == null) { }
  else {
    for (let i = 0; i < matchOnto2.length; i++) {

      resultadoOntology = resultadoOntology.replace(matchOnto2[i], matchOnto2[i].slice(0, -1) + ',' + '"')
    }
  }

  resultadoOntology = resultadoOntology + "}}}"
  let regexConstraint = /constraint_definitions/
  let constraintExists = regexConstraint.test(resultadoOntology)

  if (constraintExists) {
    resultadoOntology = resultadoOntology.replace("constraint_definitions", ',' + '"' + "constraint_definitions" + '"')
  }

  //TERM BINDINGS
  resultadoOntology = resultadoOntology.replace("term_bindings", ',"term_bindings"')

  return resultadoOntology

}
