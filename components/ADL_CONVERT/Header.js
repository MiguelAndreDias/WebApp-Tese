////////////////////////
//Archetype header match
////////////////////////

export function createHeader(dataFile) {
  const regexArchtypeConcept = /archetype[\w\W]*?concept/
  const matchHeader = regexArchtypeConcept.exec(dataFile)
  let result = matchHeader[0]
  result = result.replace('concept', '')

  let regexOpenEhr = /openEHR.+\.v\d{1}/
  let matchOpenEhr = regexOpenEhr.exec(result)
  result = result.replace(matchOpenEhr, '"file_name":' + '"' + matchOpenEhr + '"' + '}}')

  let regexArchtype = /archetype/
  let matchArchtype = regexArchtype.exec(result)
  result = result.replace(matchArchtype, '{' + '"' + matchArchtype + '"' + ':')

  let regexAdlVersion = /[(]adl_version=/
  let matchAdlVersion = regexAdlVersion.exec(result)
  result = result.replace(matchAdlVersion, '{"' + matchAdlVersion[0].substring(1, 12) + '"' + ':')

  let regexUid = /uid/
  let matchUid = regexUid.exec(result)
  result = result.replace(matchUid, '"' + matchUid + '"' + ':')

  let regexRest = /=[\d\D]{8}-[\d\D]{4}-[\d\D]{4}-[\d\D]{4}-[\d\D]{12}[)]/
  let matchRest = regexRest.exec(result)
  result = result.replace(matchRest, '"' + matchRest[0].substring(1, 37) + '"' + ',')


  result = result.replace(';', ',')

  //Tira o specialise que alguns ficheiros têm
  result = result.replace(/specialise\s+openEHR.+/, "")
  return result
}
