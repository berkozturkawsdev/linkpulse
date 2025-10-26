import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class LinkpulseInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function
    const scanLambda = new lambda.Function(this, "ScanLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler.handler",
      code: lambda.Code.fromAsset("../linkpulse-api"),
      memorySize: 1024,
      timeout: cdk.Duration.minutes(5),
      environment: { MAX_LINKS: "50" },
    });

    // HTTP API
    const api = new apigateway.RestApi(this, "ScanRestApi");

    // Lambda integration
    const lambdaIntegration = new LambdaIntegration(scanLambda);

    api.root.addResource("scan").addMethod("POST", lambdaIntegration);

    // Output API URL
    new cdk.CfnOutput(this, "ApiUrl", { value: api.url ?? "No URL" });
  }
}
