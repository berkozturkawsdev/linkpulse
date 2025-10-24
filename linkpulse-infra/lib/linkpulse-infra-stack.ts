import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class LinkpulseInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for scan results
    const resultsBucket = new s3.Bucket(this, "ScanResultsBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Lambda function
    const scanLambda = new lambda.Function(this, "ScanLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler.handler",
      code: lambda.Code.fromAsset("../linkpulse-api"),
      memorySize: 1024,
      timeout: cdk.Duration.minutes(5),
      environment: { BUCKET_NAME: resultsBucket.bucketName },
    });

    resultsBucket.grantPut(scanLambda);

    // HTTP API
    const api = new apigateway.RestApi(this, "ScanRestApi");

    // Lambda integration
    const lambdaIntegration = new LambdaIntegration(scanLambda);

    api.root.addResource("scan").addMethod("POST", lambdaIntegration);

    // Output API URL
    new cdk.CfnOutput(this, "ApiUrl", { value: api.url ?? "No URL" });
  }
}
