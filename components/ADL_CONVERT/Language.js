//////////////////////////
//Archetype Language match
//////////////////////////

import { matchData } from './extraFunctions.js'


export function createLanguage(dataFile) {

  let resultadoLanguage = matchData(/language[\w\W]*?description/, "description", dataFile)

  resultadoLanguage = resultadoLanguage.replace(/language/, '{' + "language" + ':' + '{')
  resultadoLanguage = resultadoLanguage.replace(/language/g, '"language"')
  resultadoLanguage = resultadoLanguage.replace('original_"language"', '"original_language"')
  resultadoLanguage = resultadoLanguage.replace("translations", '"translations"')
  resultadoLanguage = resultadoLanguage.replace(/author/g, '"author"')
  resultadoLanguage = resultadoLanguage.replace(/accreditation/g, '"accreditation"')

  const regex3 = /ISO.*/g
  const regex4 = /::.*/g

  let matchISO = resultadoLanguage.match(regex3)
  let matchLang = resultadoLanguage.match(regex4)

  for (let i = 0; i < matchISO.length; i++) {
    resultadoLanguage = resultadoLanguage.replace(matchISO[i], '"' + matchLang[i].slice(2) + '"')
  }

  const regex5 = /".*?" : ".*?"/g
  let match5 = resultadoLanguage.match(regex5)

  for (let i = 0; i < match5.length; i++) {
    resultadoLanguage = resultadoLanguage.replace(match5[i], match5[i] + ",")
  }




  //resultadoLanguage = resultadoLanguage.replace(/\s/g,'')



  //Por a virgula antes do termo seguinte

  let regex6 = /}[\s]+"/g
  let match6 = resultadoLanguage.match(regex6)

  if (match6 == null) {

  }
  else {

    for (let i = 0; i < match6.length; i++) {
      resultadoLanguage = resultadoLanguage.replace(match6[i], '}' + ',' + '"')
    }
  }

  //Tirar a virgula do ultimo termo

  //caso se tiver apenas 3 linhas
  if (resultadoLanguage.split(/\r\n|\r|\n/).length == 3) {
    resultadoLanguage = resultadoLanguage.replace(',', '')

  }

  //console.log(resultadoLanguage)

  let regexVirgula = /",[\s]+}/g
  let matchVirgula = resultadoLanguage.match(regexVirgula)


  if (matchVirgula == null) {

  }
  else {

    for (let i = 0; i < matchVirgula.length; i++) {

      resultadoLanguage = resultadoLanguage.replace(matchVirgula[i], '"' + '}')
    }

  }


  resultadoLanguage = resultadoLanguage + "}}"




  return resultadoLanguage

}