import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ds from 'aws-cdk/aws-appsync.DynamoDbDataSource';
import * as ddb from '@aws-cdk/aws-dynamodb';
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'AccountAPI', {
      name: 'account-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: false,
    });

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
     value: api.graphqlUrl
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    const accountTable = new ddb.Table(this, 'AccountAPITable', {
      tableName: "AccountAPITable",
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    const dynamoData = api.addDynamoDbDataSource('AccountAPI', accountTable) {}

        const accountTableRole = new Role(this, 'ItemsDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    accountTableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const dynamoDS = new ds.DynamoDbDataSource(this, 'AccountAPIDataSource', { 
      api: api,
      table: accountTable.tableName,
      serviceRole: accountTableRole

    });



    // const dataSource = new CfnDataSource(this, 'ItemsDataSource', {
    //   apiId: api.name,
    //   name: 'ItemsDynamoDataSource',
    //   type: 'AMAZON_DYNAMODB',
    //   dynamoDbConfig: {
    //     tableName: accountTable.tableName,
    //     awsRegion: this.region
    //   },
    //   serviceRoleArn: accountTableRole.roleArn
    // });
   }
}