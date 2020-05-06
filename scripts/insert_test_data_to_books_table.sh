#!/bash/bin

# You must configure your profile before run this script
# either use `aws configure`
# or cd `~/.aws` then manually edit `config` and `credentials` files 

aws dynamodb put-item \
    --table-name books \
    --item '{
        "Title": {"S": "book-1"},
        "Author": {"S": "Jeffrey"}
      }' \
    --return-consumed-capacity TOTAL \
    --profile jeffrey \
    --region us-east-1

aws dynamodb put-item \
    --table-name books \
    --item '{ 
        "Title": {"S": "book-2"}, 
        "Author": {"S": "Kevin"}
      }' \
    --return-consumed-capacity TOTAL \
    --profile jeffrey \
    --region us-east-1

aws dynamodb put-item \
    --table-name books \
    --item '{ 
        "Title": {"S": "book-3"}, 
        "Author": {"S": "Tom"}
      }' \
    --return-consumed-capacity TOTAL \
    --profile jeffrey \
    --region us-east-1