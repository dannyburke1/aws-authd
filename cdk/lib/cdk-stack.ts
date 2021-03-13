import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountAPI = new apigateway.RestApi(this, 'aws-account-api');

    accountAPI.root.addMethod('ANY');
  }
}
