const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

exports.handler = async function (event, context) {
  // Acceptable simple GET response
  // const response = {
  //   statusCode: 200,
  //   headers: {
  //     my_header: "my_value",
  //   },
  //   body: JSON.stringify(event),
  //   isBase64Encoded: false,
  // };
  const params = {
    TableName: "books",
  };

  try {
    const data = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        my_header: "my_value",
      },
      body: JSON.stringify(data),
      isBase64Encoded: false,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
