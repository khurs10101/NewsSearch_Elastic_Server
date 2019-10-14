const { Client } = require('@elastic/elasticsearch')
//const client = new Client({ node: 'http://localhost:9200' })
const client = new Client({ node: 'http://search.ns-maap.com:9200' })

exports.customAnalytics= (req, res, next)=> {
    
}