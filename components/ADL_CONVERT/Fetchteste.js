import fetch, { Headers } from 'node-fetch';
import {convert64} from "./extraFunctions.js"



/*   async function getRepository(rmType){


let url = "https://api.github.com/"
let getRepoContent = "repos/MiguelAndreDias/CKM-mirror/contents/local/archetypes/"
//let rmType= "cluster" 
//let file = "openEHR-EHR-CLUSTER.waveform.v0.adl"

let filename = ""


await fetch(url + getRepoContent + rmType   , {
headers: new Headers({
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'Bearer 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',
    
    })
}).then(res => res.json()).then( json => {
  filename = json



  console.log(filename)
  

  
  


})


} 


await getRepository("cluster") */

/*  async function getRepository(rmType){


  let url = "https://api.github.com/"
  let getRepoContent = "repos/gestaopedidosehr/CKM-mirror/contents/local/archetypes/"
  //let rmType= "cluster" 
  //let file = "openEHR-EHR-CLUSTER.waveform.v0.adl"
  
  let filename = ""
  
  
  let response = await fetch(url + getRepoContent + rmType   , {
  headers: new Headers({
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'Bearer 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',
      
      })
  });

  let data = await response.json();

  return data




}
 */



/* 
let cena = "CLUSTER"
console.log(cena.toLowerCase())
let obj = await getRepository(cena.toLowerCase())

console.log("FIM")

let stringObj = JSON.stringify(obj)
console.log(stringObj)
let regexInclude = /openEHR-EHR-CLUSTER\.document_entry_metadata(-[a-zA-Z0-9_]+)*\.v1|openEHR-EHR-CLUSTER\.document_entry_metadata(-[a-zA-Z0-9_]+)*\.v0/
let matchInclude = stringObj.match(regexInclude)
console.log(matchInclude[0])
 


 
   */



/* 

//setTimeout(getData, 7000)
function myGreeting(){
  let cena = "Ola"
  return cena
}

//getData() 


function qualquer(string){
  let cena2 = string + "João"
  console.log(cena2)
}


//setTimeout(myGreeting, 5000)

setTimeout(qualquer, 6000, myGreeting())
/* await fetch(url2, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' 
}).then(res => console.log(res.text)) */

/* function greet() {
  console.log('Hello world');
}

setTimeout(greet, 3000);
console.log('This message is shown first');
 */




/* console.log("Ola")

  let url2 = "https://raw.githubusercontent.com/gestaopedidosehr/CKM-mirror/master/local/archetypes/cluster/openEHR-EHR-CLUSTER.document_entry_metadata.v0.adl"
  let response = fetch(url2).then(res => res.text()).then(text => {

  
    console.log(text)
    console.log("Adeus")
  }
    )

  console.log("fim")
  console.log(response) */



let lista = ["leite", "bolacha"]
let lista2 = []
for (let i = 0 ; i < lista.length; i++){

  if(lista[i] == "leite"){

    let url2 = "https://raw.githubusercontent.com/gestaopedidosehr/CKM-mirror/master/local/archetypes/cluster/openEHR-EHR-CLUSTER.document_entry_metadata.v0.adl"
    let response = fetch(url2).then(res => res.text()).then(text => {
                  let include = text
                  lista2.push(include)
                  
                    console.log(text)
                    console.log("Adeus")
                    console.log(lista2)
                }
                    )
    console.log("sim")
  }
  else{
    console.log("nao")
  }
}

console.log(lista2)