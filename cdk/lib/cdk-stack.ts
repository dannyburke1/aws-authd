import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'AccountAPI', {
      name: 'aws-accounts-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      xrayEnabled: false,
    });

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
     value: api.graphqlUrl
    });

    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    const accountTable = new ddb.Table(this, 'AwsAccountsTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    const dynamoData = api.addDynamoDbDataSource('dynamoDBDataSource', accountTable);
   }

}