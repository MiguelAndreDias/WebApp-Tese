
import xml2js from 'xml2js'
import { createJson } from '../../../components/ADL_CONVERT/jsonFinal';

function convert64(base64encoded) {
    let utf8encoded = Buffer.from(base64encoded, 'base64').toString('utf8');
    return utf8encoded
}

//converter xml to json file
function xmlConverter(ficheiro) {

    xml2js.parseString(ficheiro, (err, result) => {
        if (err) {
            throw err;
        }

        // `result` is a JavaScript object
        // convert it to a JSON string
        const json = JSON.stringify(result, null, 4);

        // log JSON string
        return json

    });
}

export default async function handler(req, res) {
    const { slug } = req.query;

    let url = slug.join("/")

    let result = await fetch(`${process.env.GITHUB_API}${process.env.GITHUB_CKMMirror_Contents}${url}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.GITHUB_Token}`,
        }
    }).then(res => res.json());

    let content = convert64(result.content)

    let final = createJson(content)

    res.status(200).send(final);
}
