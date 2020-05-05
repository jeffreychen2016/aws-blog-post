exports.handler = async function (event, context) {
    const response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(event),
        "isBase64Encoded": false
    };

    return response;
}