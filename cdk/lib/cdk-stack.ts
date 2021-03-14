import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountAPI = new api.RestApi(this, 'aws-account-api');

    accountAPI.root.addMethod('ANY');
    const integration = new accountAPI.HttpIntegration('http://amazon.com');

    const v1 = accountAPI.root.addResource('v1');
    const echo = v1.addResource('echo');
    const echoMethod = echo.addMethod('GET', integration, { apiKeyRequired: true });
    const key = accountAPI.addApiKey('ApiKey');

    const plan = accountAPI.addUsagePlan('UsagePlan', {
      name: 'Easy',
      apiKey: key,
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    });

  plan.addApiStage({
    stage: accountAPI.deploymentStage,
    throttle: [
      {
        method: echoMethod,
        throttle: {
          rateLimit: 10,
          burstLimit: 2
        }
      }
    ]
   });
  }
}