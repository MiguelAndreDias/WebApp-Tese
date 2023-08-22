//////////////////////////
//Archetype concept match
//////////////////////////



export function createConcept(dataFile) {
  const fileRegex = /concept[\w\W]*?language/
  const matchConcept = fileRegex.exec(dataFile)
  let resultadoConcept = matchConcept[0]
  resultadoConcept = resultadoConcept.replace('language', '')

  resultadoConcept = resultadoConcept.replace(/concept/, '{' + '"concept"' + ':')
  let regexAT = /\[at.+?\]/
  let matchAT = resultadoConcept.match(regexAT)
  matchAT = matchAT[0]
  matchAT = matchAT.replace("[", "")
  matchAT = matchAT.replace("]", "")

  resultadoConcept = resultadoConcept.replace(/\[at.+\]/, '{' + '"' + matchAT + '"' + ':')


  const resultRegex = /-- \D.+/
  let matchFixe = resultRegex.exec(resultadoConcept)
  resultadoConcept = resultadoConcept.replace(matchFixe, '"' + matchFixe[0].substring(3) + '"' + '}}')

  return resultadoConcept

}

