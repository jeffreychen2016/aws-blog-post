import path = require('path')
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apikey from '@aws-cdk/aws-apigateway'
import { ApiKey } from '@aws-cdk/aws-apigateway';

export class BlogPostStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create dynamodb table
    // const booksTable = new dynamodb.Table(this, 'books-table', {
    //   partitionKey: {name: 'Title', type: dynamodb.AttributeType.STRING}
    // })

    // 1. create lambda function
    // 2. create lambda integration
    // 3. create restful api
    // 4. create source
    // 5. create method using lambda integration
    // 6. create api key
    // 7. create usage plan
    // 8. bind usage plan to api stage

    // create api key
    // const testApiKey = new ApiKey(this, 'testApiKey', {
    //   apiKeyName: 'testApiKey',
    //   enabled: true,
    //   // resources: [booksApi]
    // })

    // 1. create lambda function
    const getBooksFunction = new lambda.Function(this, 'getBooksFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'getBooksFunction.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets'))
    })

    const getBookFunction = new lambda.Function(this, 'getBookFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'getBookFunction.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets'))
    })

    // 2. create lambda integration
    const getBooksFunctionIntegration = new apigateway.LambdaIntegration(getBooksFunction);
    const getBookFunctionIntegration = new apigateway.LambdaIntegration(getBookFunction);


    // 3. create restful api
    const booksApi = new apigateway.RestApi(this, 'books-api', {
      restApiName: 'books-api', 
      description: 'api for getting books',
    });

    // 4. create resource
    const books = booksApi.root.addResource('books');
    const book = books.addResource('{book_id}')

    // 5. create method
    books.addMethod('GET', getBooksFunctionIntegration, {apiKeyRequired: true})
    book.addMethod('GET', getBookFunctionIntegration, {apiKeyRequired: true})

    // 6 .create a new api key
    // TODO: this method create api key with random key name
    // find a way to generate key with custom name and import to usageplan config
    const apiKey = booksApi.addApiKey('ApiKey')

    // 7. create usage plan
    // this controls how the api key can access the api endpoint
    // e.g. 1000 requests per month, 10 requests per second (12 at most)
    const plan = booksApi.addUsagePlan('usagePlan', {
      name:'plan-A',
      description: 'usage plan A',
      apiKey: apiKey,
      quota: {
        limit: 1000, 
        period: apigateway.Period.MONTH
      },
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      }
    })

    // 8. allow the api key to access the api endpoints on {x} stage
    // stage is created upon deployment
    plan.addApiStage({
      stage: booksApi.deploymentStage,
    })
  }
}

