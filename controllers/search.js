const { Client } = require('@elastic/elasticsearch')
//const client = new Client({ node: 'http://localhost:9200' })
const client = new Client({ node: 'http://search.ns-maap.com:9200' })



exports.customSearch= (req, res, next)=>{
    //validate if the body is not empty
    let inputJson= req.body;
    let query= preprocessing(inputJson)
    elasticSearch(query, res)
}

const preprocessing= (inputJson)=>{

    //check if the fields are empty or not
    let sort= inputJson._sort
    let count= inputJson.count
    let input_sentiment= inputJson.sentiment
    let fromDate= inputJson.fromDate
    let toDate= inputJson.toDate
    let headline= inputJson.headline
    let articleText= inputJson.articleText
    let author= inputJson.journalist

    console.log(input_sentiment)
    console.log(toDate)
    console.log(fromDate)
    console.log(headline)
    console.log(articleText)
    console.log(author)

    

    

    //search only by headline only
    if((headline!== undefined) && (articleText=== undefined)){

        console.log("headline only")
        console.log(headline)
        console.log(articleText)
         
        let query={
            query:{
                bool:{
                    must:[
                        {
                            match_phrase_prefix:{
                                title: headline
                            }
                        }
                    ]
                }
            }
        }

        return query
    }

    //headline and article text only
    if((headline!== undefined) && (articleText!== undefined)
        && (toDate===undefined) && (fromDate===undefined)){

            console.log("headline + article only")
        let query={
            query:{
                bool:{
                    must:[
                        {
                            match_phrase_prefix:{
                                title: headline
                            },

                            match_phrase_prefix:{
                                text: articleText
                            }
                        }
                    ]
                }
            }
        }
        return query
    }

    //fromDate and toDate only
    if((fromDate!== undefined) && (toDate!== undefined)){

        console.log("fromdate to date only")
        let query={
            query:{
                bool:{
                    must:[
                        {
                            range:{
                                status_published:{
                                    gte: fromDate,
                                    lte: toDate
                                }
                            }
                        }
                    ]
                }
            }
        }

        return query

    }

    //search by author only
    if((author!== undefined)){
        console.log("author only")
        let query={
            query:{
                bool:{
                    must:[
                        {
                            match_phrase_prefix:{
                                author: author
                            }
                        }
                    ]
                }
            }
        }

        return query
    }

    //sentiment
    if(input_sentiment!== undefined){

        
        let query={
            query: {
              bool: {
                must: [
                  {
                    range: {
                      'sentiment.sentimentPosScore': {
                        gte: input_sentiment.gte,
                        lte: input_sentiment.lte
                      }
                    }
                  }
                ]
              }
            }
          }
        console.log(query)
        return query

    }

}

const elasticSearch= (query, res)=>{
    async function run(){

        const { body }= await client.search({
    
            index: 'fbook',
            body: query
        })
    
        console.log(body.hits.hits)
        res.send(body.hits.hits)
        res.end()
    }
    
    run().catch(console.log)
}