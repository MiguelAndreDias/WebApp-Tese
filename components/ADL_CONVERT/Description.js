///////////////////
//DESCRIPTION MATCH
///////////////////

import { matchData } from './extraFunctions.js'

export function createDescription(dataFile) {
  let regexDescription = /description[\w\W]*?definition/
  let matchDesc = regexDescription.exec(dataFile)

  let resultadoDescription = matchDesc[0]


  //Tirar o desnecessario
  const descriptionUnnecessaryProps = ["purpose", "misuse", "use", "keywords", "copyright", "lifecycle_state", "other_contributors"]

  for (let i = 0; i < descriptionUnnecessaryProps.length; i++) {
    let regexDesc = new RegExp(descriptionUnnecessaryProps[i] + ' = <[\\d\\D]*?>', 'g')

    let matchKeywords = resultadoDescription.match(regexDesc)
    if (matchKeywords == null) {

    }
    else {


      for (let j = 0; j < matchKeywords.length; j++) {
        resultadoDescription = resultadoDescription.replaceAll(matchKeywords[j], '')
      }

    }


  }

  resultadoDescription = resultadoDescription.replace(/other_details =[\d\D]+>/, '')



  resultadoDescription = matchData(/description[\w\W]*?definition/, "definition", resultadoDescription)



  let descriptionProps = ["description", "original_author", "details", "language"]


  for (let i = 0; i < descriptionProps.length; i++) {

    resultadoDescription = resultadoDescription.replaceAll(descriptionProps[i], '"' + descriptionProps[i] + '"')

  }


  let regexISO = /ISO.+/g
  let matchISO = resultadoDescription.match(regexISO)
  matchISO.forEach((element) => {
    resultadoDescription = resultadoDescription.replaceAll(element, '"' + element + '"')
  })




  //VIRGULA

  const regexDot = /".*?" : ".*?"/g
  const matchVDot = resultadoDescription.match(regexDot)
  let uniqMatch = [...new Set(matchVDot)]



  for (let i = 0; i < uniqMatch.length; i++) {

    resultadoDescription = resultadoDescription.replaceAll(uniqMatch[i], uniqMatch[i] + ",")

  }









  //Tirar virgula no ultimo termo

  let regexComma = /,\s+}/g

  let matchComma = resultadoDescription.match(regexComma)


  if (matchComma == null) {
    resultadoDescription = resultadoDescription.replace('",', '"')
  }
  else {
    for (let i = 0; i < matchComma.length; i++) {

      resultadoDescription = resultadoDescription.replace(matchComma[i], '}')
    }
  }






  //Por virgula antes de certos termos

  let regexV = /}\s+"/g


  let matchVirgula = resultadoDescription.match(regexV)


  if (matchVirgula == null) {

  }
  else {
    for (let i = 0; i < matchVirgula.length; i++) {

      resultadoDescription = resultadoDescription.replace(matchVirgula[i], matchVirgula[i].slice(0, -1) + ',' + '"')
    }
  }




  resultadoDescription = resultadoDescription.replace(/"description"/, '{' + '"description"' + ':' + '{')
  resultadoDescription = resultadoDescription + "}}"



  return resultadoDescription

}

