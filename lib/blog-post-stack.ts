import path = require("path");
import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apikey from "@aws-cdk/aws-apigateway";
import { ApiKey } from "@aws-cdk/aws-apigateway";
import { LayerVersion, Code, Runtime } from "@aws-cdk/aws-lambda";
import { PolicyStatement, Effect } from "@aws-cdk/aws-iam";

export class BlogPostStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 0. create utility layer for lambdas
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

    // 0. create utility layer
    const utilityLayer = new LayerVersion(this, "getBooksApiUtilityLayer", {
      code: Code.fromAsset(path.join(__dirname, "assets", "utilities")),
      compatibleRuntimes: [Runtime.NODEJS_10_X, Runtime.NODEJS_12_X],
    });

    // 1. create lambda function with utility layer
    const getBooksFunction = new lambda.Function(this, "getBooksFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      // [file_name].handler
      handler: "getBooksFunction.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "assets", "functions")),
      layers: [utilityLayer],
    });

    const getBookFunction = new lambda.Function(this, "getBookFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      // [file_name].handler
      handler: "getBookFunction.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "assets", "functions")),
      layers: [utilityLayer],
    });

    // 2. create lambda integration
    const getBooksFunctionIntegration = new apigateway.LambdaIntegration(
      getBooksFunction
    );
    const getBookFunctionIntegration = new apigateway.LambdaIntegration(
      getBookFunction
    );

    // 3. create restful api
    const booksApi = new apigateway.RestApi(this, "books-api", {
      restApiName: "books-api",
      description: "api for getting books",
    });

    // 4. create resource
    // GET root/books
    // GET root/books/{book_title}
    const books = booksApi.root.addResource("books");
    const book = books.addResource("{book_title}");

    // 5. create method
    books.addMethod("GET", getBooksFunctionIntegration, {
      apiKeyRequired: true,
    });
    book.addMethod("GET", getBookFunctionIntegration, { apiKeyRequired: true });

    // 6 .create a new api key
    // use this approach to create api key with custom name
    const customApiKey = new ApiKey(this, "customApiKey", {
      apiKeyName: "custom-api-key",
    });

    // use this approach to create api key with random name on flight
    // const apiKey = booksApi.addApiKey("ApiKey");

    // 7. create usage plan
    // this controls how the api key can access the api endpoint
    // e.g. 1000 requests per month, 10 requests per second (12 at most)
    const plan = booksApi.addUsagePlan("usagePlan", {
      name: "plan-A",
      description: "usage plan A",
      // bind the api key with the rest apis
      apiKey: customApiKey,
      quota: {
        limit: 1000,
        period: apigateway.Period.MONTH,
      },
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    // 8. allow the api key to access the api endpoints on {x} stage
    // stage is created upon deployment
    plan.addApiStage({
      stage: booksApi.deploymentStage,
    });

    // 9. create dynamodb
    const booksTable = new dynamodb.Table(this, "books-table", {
      tableName: "books",
      partitionKey: { name: "Title", type: dynamodb.AttributeType.STRING },
    });

    // 10. grant the lambda function the permission to access dynamodb
    const getItemPolicy = new PolicyStatement({
      actions: ["dynamodb:GetItem"],
      effect: Effect.ALLOW,
      resources: [booksTable.tableArn],
    });

    const scanTablePolicy = new PolicyStatement({
      actions: ["dynamodb:Scan"],
      effect: Effect.ALLOW,
      resources: [booksTable.tableArn],
    });

    getBookFunction.addToRolePolicy(getItemPolicy);
    getBooksFunction.addToRolePolicy(scanTablePolicy);
  }
}
