////////////////////////////
//Archetype Definition match
////////////////////////////

//Needed to have both import and requires in the same file
import estruturasDV from './Estruturas.js'
import { createJson } from "./jsonFinal.js"
import { createOntology } from "./Ontology.js";
import fetch from 'sync-fetch';

function createNode(string, ontologyItems) {

    let objNode = {}

    let regexNode = /[A-Z_ ]+\[at.+\].+matches.+{/

    let matchNode = string.match(regexNode)
    matchNode = matchNode[0]





    //rmType

    let regexRMtype = /[A-Z_]+(?=\[)/
    let matchRMtype = matchNode.match(regexRMtype)
    matchRMtype = matchRMtype[0]
    objNode["rmType"] = matchRMtype



    //Occurrences
    let regexOccur = /{....}/
    let matchOccur = matchNode.match(regexOccur)
    //

    if (matchOccur == null) {
        objNode["occurrences"] = {}
        objNode.occurrences["lowerOccurence"] = '1'
        objNode.occurrences["upperOccurence"] = '1'

    }
    else {

        matchOccur = matchOccur[0]
        let lowerOccurrence = matchOccur[1]
        let upperOccurrence = matchOccur[4]
        objNode["occurrences"] = {}
        objNode.occurrences["lowerOccurence"] = lowerOccurrence
        objNode.occurrences["upperOccurence"] = upperOccurrence

    }



    //code
    let regexCode = /\[at.+\]/
    let matchCode = matchNode.match(regexCode)

    matchCode = matchCode[0]
    matchCode = matchCode.replace("[", "")
    matchCode = matchCode.replace("]", "")
    objNode["node"] = {}
    objNode.node["code"] = matchCode


    objNode.node["text"] = ontologyItems[matchCode]["text"]


    objNode.node["description"] = ontologyItems[matchCode]["description"]

    return objNode
}

function createDVCODED(string, ontologyItems) {


    let objValue = {}
    objValue["dataType"] = "DV_CODED_TEXT"
    objValue["value"] = []



    //Regex para buscar o defining_code matches (local)
    let regexLocal = /\[local::[\d\D]+?\]/g
    let matchLocal = string.match(regexLocal)

    ////Regex para buscar o defining_code matches (constraint)
    if (matchLocal == null) {
        let regexconstraint = /ac.+?(?=[,\]])/g
        let matchLocal = string.match(regexconstraint)
        if (matchLocal == null) {
            return objValue
        }


    }

    if (matchLocal.length == 1) {
        matchLocal = matchLocal[0]
    }
    else {
        //Caso em que os codigos dos DVcoded_text estão colocados em listas diferentes (cada um em local diferente)
        //Junta os resultados do array num string
        matchLocal = matchLocal.join()
    }



    let regexCode = /a[ct][\d\.]+/g
    let matchCode = matchLocal.match(regexCode)





    for (let k = 0; k < matchCode.length; k++) {

        let objDVCODED = {}
        objDVCODED["code"] = matchCode[k]

        objDVCODED["text"] = ontologyItems[matchCode[k]]["text"]
        objDVCODED["description"] = ontologyItems[matchCode[k]]["description"]
        objValue["value"].push(objDVCODED)

    }

    return objValue


}





//Tambem dá para usar esta função com value matches ou outras que tenham apenas DV codes
function createNameMatches(string, ontologyItems) {

    let objName = {}
    let regexDV = /DV[\w]+/g
    let matchDV = string.match(regexDV)



    objName["name_matches"] = []

    for (let i = 0; i < matchDV.length; i++) {

        //Se for DVCODED_TEXT cria uma lista com os values e vai buscar os valores ao ontology
        if (matchDV[i] == "DV_CODED_TEXT") {

            let objValue = createDVCODED(string, ontologyItems)



            objName["name_matches"].push(objValue)
        }
        else {


            let objValue = {}
            objValue["dataType"] = matchDV[i]
            objValue["value"] = estruturasDV[matchDV[i]]
            objName["name_matches"].push(objValue)


        }

    }
    if (string.includes("value matches")) {
        objName = JSON.stringify(objName)
        objName = objName.replaceAll("name_matches", "value_matches")
        objName = JSON.parse(objName)
    }


    return objName




}




function getRepository(rmType) {
    const endpoint = `${process.env.GITHUB_API}${process.env.GITHUB_RepoContent}${rmType}`;

    const response = fetch(endpoint, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${process.env.GITHUB_Token}`,
        }
    });

    const data = response.text();

    return data
}



function createItemsMatches(string, type = null, ontologyItems) {
    let objItems = {}
    objItems["items"] = []

    let regexElements = /CLUSTER\[at.+?\][\d\D]+?{[\d\D]+?items[\d\D]+?{|(ELEMENT\[at.+?\].+?})(?=\s*(?:ELEMENT|CLUSTER|allow_archetype|$))|(allow_archetype.+?})(?=\s*(?:ELEMENT|CLUSTER|allow_archetype|$))/gs
    let matchElements = string.match(regexElements)//DEPOIS USAR O MATCH ITEMS NA EXPRESSAO REGULAR PARA ACHAR OS CLUSTERS SEPARADOS

    let regexItems = /items[\d\D]+?matches {[\d\D]+/g
    let matchItems = string.match(regexItems)

    matchItems = matchItems[0]



    let listaCode = ""

    if (matchElements == null) {
        return objItems
    }

    else {

        for (let i = 0; i < matchElements.length; i++) {
            if (matchElements[i].includes("ELEMENT")) {
                let regexCode = /\[at.+\]/g
                let matchCode = matchElements[i].match(regexCode)
                matchCode = matchCode[0]

                if (listaCode.includes(matchCode)) {

                }

                else {

                    let objElement = createNode(matchElements[i], ontologyItems)

                    let objELementValues = createNameMatches(matchElements[i], ontologyItems)

                    objElement = {
                        ...objElement,
                        ...objELementValues
                    }

                    objItems["items"].push(objElement)
                }


            }


            ///////////////////
            //INCLUDE ARCHETYPE
            //////////////////
            else if (matchElements[i].includes("allow_archetype")) {
                //console.log(ontologyItems)
                let nodeAllowArchetype = createNode(matchElements[i], ontologyItems)
                nodeAllowArchetype["xsi_type"] = "C_ARCHETYPE_ROOT"
                nodeAllowArchetype["include"] = []




                //Ver o rm type do archetype a incluir
                let regexRMtype = /(?<=openEHR-EHR-)\w+(?=\\\.)/
                let rmType = matchElements[i].match(regexRMtype)



                //Se não der match ignora o allow_archetype
                //Caso em existe ficheiros cluster na pasta demographic porque por alguma razão
                //a expressão regular é diferente
                if (rmType == null) {
                    regexRMtype = /openEHR-DEMOGRAPHIC-CLUSTER/
                    let existe = regexRMtype.test(matchElements[i])
                    if (existe) {
                        rmType = "demographic"
                    }
                    else {
                        break
                    }


                }

                else {
                    rmType = rmType[0].toLowerCase()
                }






                //fazer fetch do repositorio especifico ao rmType
                let objRepositoryString = getRepository(rmType)

                //Vai buscar a expressão regular no allow archetype
                let regexOpenEHR = /\/openEHR.+\//g
                let matchRegexOpenEHR = matchElements[i].match(regexOpenEHR)
                matchRegexOpenEHR = matchRegexOpenEHR[0]

                //Cria uma expressão regular com a anterior para ir buscar o link https ao repositorio selecionado
                function getHTTPSRegex(filenameRegex, rmType) {

                    let url = "https:\/\/raw.githubusercontent\.com\/MiguelAndreDias\/CKM-mirror\/main\/local\/archetypes\/"
                    //varia com o tipo de ficheiro
                    filenameRegex = filenameRegex.substring(1)
                    filenameRegex = filenameRegex.slice(0, -1)
                    filenameRegex = "(" + filenameRegex + ")"

                    //varia com a Regex de cada ficheiro
                    rmType = rmType + "\/"
                    let extension = "\.adl"

                    let regexFinal = new RegExp(url + rmType + filenameRegex + extension, "g")
                    return regexFinal

                }


                let regexFetch = getHTTPSRegex(matchRegexOpenEHR, rmType)

                let matchFetch = objRepositoryString.match(regexFetch)

                if (matchFetch == null) {

                }
                else {
                    matchFetch = matchFetch[0]
                    function fetchFileContent(httpsLink) {

                        const response = fetch(httpsLink)
                        const data = response.text()
                        return data

                    }

                    let fileinclude = fetchFileContent(matchFetch)



                    //Função recursiva
                    let includeArch = createJson(fileinclude)

                    //Resolve o bug do ontology items mudar após cada iteração
                    //Assim chama a função novamente e cria um objecto novo com os dados do ficheiro anterior/original

                    /////////////////////////////////////
                    nodeAllowArchetype["include"].push(includeArch)


                    objItems["items"].push(nodeAllowArchetype)

                }
            } else {
                let newCluster = createNode(matchElements[i], ontologyItems)
                newCluster["items"] = []

                let regexCluster = /CLUSTER[\D\d]+?[\s]+}[\s]+}[\s]+}[\s]+}/g
                let matchCluster = matchItems.match(regexCluster)
                matchCluster = matchCluster[0]
                let matchClusterElements = matchCluster.match(regexElements)
                matchClusterElements = matchClusterElements.slice(1)

                for (let j = 0; j < matchClusterElements.length; j++) {

                    //Para remover Elements repetidos no final faz-se uma lista dos codigos
                    let regexCode = /\[at.+\]/
                    let matchCode = matchClusterElements[j].match(regexCode)
                    matchCode = matchCode[0]
                    listaCode += matchCode
                    //////////////////////////////////////////////////////////////////////

                    let objNewElement = createNode(matchClusterElements[j], ontologyItems)

                    let objELementValues = createNameMatches(matchClusterElements[j], ontologyItems)

                    objNewElement = {
                        ...objNewElement,
                        ...objELementValues
                    }

                    newCluster.items.push(objNewElement)

                }



                objItems["items"].push(newCluster)




            }





        }
        let objItemsFinal;

        if (type == "CLUSTER") {
            objItemsFinal = objItems
        }
        else {
            objItemsFinal = {
                ...first,
                ...objItems
            };
        }

        return objItemsFinal

    }
}

//////////////////////
//TESTAR ITEMS MATCHES
//////////////////////




//let testeItems = createItemsMatches(testeDetails)

//////////////////////////



function createDetailsMatches(string, ontologyItems) {

    let objDetails = {}
    let objItemsDetails = createItemsMatches(string, null, ontologyItems)


    objDetails["details_matches"] = []
    objDetails["details_matches"].push(objItemsDetails)

    return objDetails


}


//let testeDetail = createDetailsMatches(testeDetails)



/* JUNTAR ESTAS FUNÇÕES!!!!! */
function createProtocolMatches(string, ontologyItems) {
    let objProtocol = {}
    let objItemsDetails = createItemsMatches(string, null, ontologyItems)
    objProtocol["protocol matches"] = []
    objProtocol["protocol matches"].push(objItemsDetails)

    return objProtocol
}


function createContextMatches(string, ontologyItems) {
    let objContext = {}
    let objItemsDetails = createItemsMatches(string, null, ontologyItems)
    objContext["context_matches"] = []
    objContext["context_matches"].push(objItemsDetails)

    return objContext
}





function createTransitionMatches(string, ontologyItems) {

    let objISMFinal = {}
    objISMFinal["ism_transition"] = []

    let regexISM = /ISM_TRANSITION\[at.+?\] matches\s+{.+?}(?=\s+ISM_TRANSITION\[at.+?\] matches|$)/gs
    let matchISM = string.match(regexISM)

    for (let i = 0; i < matchISM.length; i++) {
        let objNodeISM = createNode(matchISM[i], ontologyItems)

        //buscar os current_state e careflow_state
        let regexStateStep = /(current_state matches\s+{.+?}(?=\s+careflow_step matches|$))|(careflow_step matches[\d\D]+)/gs
        let matchStateStep = matchISM[i].match(regexStateStep)

        //Regex com os dvs

        let regexDV = /DV[\w]+/g
        let matchDV = matchStateStep[0].match(regexDV)

        if (matchDV == "DV_CODED_TEXT") {
            let DVcoded = createDVCODED(matchStateStep[0], ontologyItems)
            objNodeISM["current_state"] = DVcoded
        }
        else {
            DVcoded = estruturasDV[matchDV]
            objNodeISM["current_state"] = DVcoded
        }

        matchDV = matchStateStep[1].match(regexDV)
        if (matchDV == "DV_CODED_TEXT") {
            let DVcoded = createDVCODED(matchStateStep[1], ontologyItems)
            objNodeISM["careflow_step"] = DVcoded
        }
        else {
            let DVtext = estruturasDV[matchDV]
            objNodeISM["careflow_step"] = DVcoded
        }

        objISMFinal["ism_transition"].push(objNodeISM)


    }


    return objISMFinal

}


function removeMatches(string) {
    string = string.replaceAll("upper matches", "")
    string = string.replaceAll("lower matches", "")

    return string
}


let objMatchCheck = {
    "name matches": createNameMatches,
    "category matches": createNameMatches,
    "details matches": createDetailsMatches,
    "description matches": createDetailsMatches,
    "credentials matches": createDetailsMatches,
    "items matches": createDetailsMatches,
    "context matches": createContextMatches,
    "ism_transition matches": createTransitionMatches,
    "protocol matches": createProtocolMatches
}


//Função que procura os matches e depois chama as outras funções em função do tipo de match que é
export function createAllMatches(string) {

    //Cria um objecto com os termos de Ontology 
    const auxOntology = createOntology(string);

    let objOntology = JSON.parse(auxOntology)
    let ontologyItems = objOntology.ontology.term_definitions.en.items




    if (JSON.stringify(objOntology).includes("constraint_definitions")) {
        let ontologyConstraints = objOntology.ontology.constraint_definitions.en.items
        ontologyItems = {
            ...ontologyConstraints,
            ...ontologyItems
        }
    }



    //Vai buscar só a parte do definition
    let regexDefinition = /definition[\w\W]*ontology/
    let matchDef = regexDefinition.exec(string)
    string = matchDef[0]

    //Cria o primeiro node
    let firstNode = {}
    firstNode = createNode(string, ontologyItems)






    let objAllMatches = {}

    //tira o espaço vazio no final (Necessário para a expressão regular regexMaType funcionar corretamente)
    string = string.replace(/}[\r\n]+ontology/, "}")
    //Tira a primeira referencia a "occurrences" necessário para os matches darem bem
    string = string.replace("occurrences", "")

    //Tirar o termo cardinality
    string = string.replace(" cardinality", "")

    string = removeMatches(string)


    //Faz match dos diferentes tipos de matches existentes (Name matches, definition matches, protocol matches...)
    let regexMaType = /[a-z_]+ matches\s+{.+?}(?=\s+[a-z]+ matches|$)/gs
    let matchMaType = string.match(regexMaType)

    for (let i = 0; i < matchMaType.length; i++) {

        let regexMaType = /[a-z_]+ matches/  //só é necessario a primeira instancia logo não se põe o "g"
        let matchFinalType = matchMaType[i].match(regexMaType)
        matchFinalType = matchFinalType[0];

        let objMatch;
        if (firstNode.rmType == "CLUSTER") {

            objMatch = createItemsMatches(matchMaType[i], "CLUSTER", ontologyItems)

        }
        else {

            var matchesFunction = objMatchCheck[matchFinalType]
            objMatch = matchesFunction(matchMaType[i], ontologyItems)
        }

        objAllMatches = {
            ...firstNode,
            ...objAllMatches,
            ...objMatch
        };




    }

    return objAllMatches
}




/* let testeCreateAllMatches = createAllMatches(dataFile)
console.log(111111111)
console.log(testeCreateAllMatches.items[0]) 
console.log(JSON.stringify(testeCreateAllMatches.items)) 

 */







