import path = require('path')
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda'

export class BlogPostStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create dynamodb table
    // const booksTable = new dynamodb.Table(this, 'books-table', {
    //   partitionKey: {name: 'Title', type: dynamodb.AttributeType.STRING}
    // })

    // create lambda function
    const getBooksFunction = new lambda.Function(this, 'getBooksFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'getBooksFunction.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets'))
    })

    // create restful api
    const booksApi = new apigateway.RestApi(this, 'books-api');
    const getBooksFunctionIntegration = new apigateway.LambdaIntegration(getBooksFunction);

    // create resource
    const books = booksApi.root.addResource('books');

    // create method
    books.addMethod('GET', getBooksFunctionIntegration)
  }
}

