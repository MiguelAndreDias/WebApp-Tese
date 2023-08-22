const githubRepoContent = "https://api.github.com/repos/gestaopedidosehr/CKM-mirror/contents/"

export default async function handler(req, res) {
    const { contentSlug } = req.query;
    
    let result = await fetch(`${githubRepoContent}${contentSlug.join('/')}`, {

    }).then(res => res.json() );

    res.status(200).send(result);
  }
  