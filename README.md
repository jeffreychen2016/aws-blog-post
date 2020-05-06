# Welcome to your CDK TypeScript project!

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`BlogPostStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Deployment

To depoy this sample stack:

1.  add your account number to you the `env` variable in `/bin/blog-post.ts` file
2.  run `cdk deploy` if you using defaul profile or `cdk deploy --profile profile_name` if you have multiple profiles
3.  wait for all resources to be created
4.  run `bash scripts/insert_test_data_to_books_table.sh` to insert some tesing data to Dynamodb

## Test

To test with postman:

1.  In AWS ApiGateway console -> Stages -> copy Invoke URL
2.  In postman -> Authorization -> change TYPE to AWS Signature -> fill in AccessKey, SecretKey, AWS Region and Service Name with 'execute-api'
3.  In postman -> Headers -> add key/value (key:x-api-key, value: the-api-key)
4.  Make sure you do not have any other weird inputs in other fields like Body before send the request.
