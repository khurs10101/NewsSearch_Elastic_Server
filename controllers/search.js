const { Client } = require('@elastic/elasticsearch')
//const client = new Client({ node: 'http://localhost:9200' })
const client = new Client({ node: 'http://search.ns-maap.com:9200' })



exports.customSearch= (req, res, next)=>{
    //validate if the body is not empty
    let inputJson= req.body;
    let news_sources= inputJson.sources
    console.log(news_sources)
    let query= preprocessing(inputJson)
    elasticSearch(query, news_sources, res)
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

        if(count!== undefined){
            query.size=count
        }
        return query
    }


    //articletext only
    if((articleText!== undefined) && (headline=== undefined)){

        console.log("article only")
        console.log(headline)
        console.log(articleText)
         
        let query={
            query:{
                bool:{
                    must:[
                        {
                            match_phrase_prefix:{
                                title: articleText
                            }
                        }
                    ]
                }
            }
        }

        if(count!== undefined){
            query.size=count
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

        if(count!== undefined){
            query.size=count
        }
        return query
    }

    //fromDate and toDate only
    if((fromDate!== undefined) && (toDate!== undefined)){

        console.log("fromdate and toDate only")
        let query={
            query:{
                bool:{
                    filter:[
                        {
                            range:{
                                post_date:{
                                    gte: fromDate,
                                    lte: toDate
                                }
                            }
                        }
                    ]
                }
            }
        }

        if(count!== undefined){
            query.size=count
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

        if(count!== undefined){
            query.size=count
        }
        
        return query
    }

    //sentiment
    if(input_sentiment!== undefined){

        
        let query={
            query: {
              bool: {
                filter: [
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

        if(count!== undefined){
            query.size= count
        }
        console.log(query)
        return query

    }

}

const elasticSearch= (query, news_sources, res)=>{
    async function run(){

        const { body }= await client.search({
    
            index: news_sources,
            body: query
        })
    
        console.log(body.hits.hits)
        res.send(body.hits.hits)
        res.end()
    }
    
    run().catch(console.log)
}