import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class LinkpulseInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // === Lambda function ===
    const scanLambda = new lambda.Function(this, "ScanLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler.handler",
      code: lambda.Code.fromAsset("../linkpulse-api"),
      memorySize: 1024,
      timeout: cdk.Duration.minutes(5),
      environment: { MAX_LINKS: "50" },
    });

    // === API Gateway ===
    const api = new apigateway.RestApi(this, "ScanRestApi", {
      restApiName: "Linkpulse API",
    });

    const lambdaIntegration = new LambdaIntegration(scanLambda);
    api.root.addResource("scan").addMethod("POST", lambdaIntegration);

    // === S3 bucket for React frontend ===
    const siteBucket = new s3.Bucket(this, "LinkpulseFrontendBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const oai = new cloudfront.OriginAccessIdentity(this, "LinkpulseOAI");
    const certificateArn = process.env.ACM_CERT_ARN!;
    // === CloudFront distribution ===
    const distribution = new cloudfront.Distribution(
      this,
      "LinkpulseDistribution",
      {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessIdentity(siteBucket, {
            originAccessIdentity: oai,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          // Optional: route /api/* to API Gateway
          "api/*": {
            origin: new origins.HttpOrigin(
              `${api.restApiId}.execute-api.${this.region}.amazonaws.com`,
              {
                originPath: "/prod", // Adjust if you have stage names
              }
            ),
            cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          },
        },
        defaultRootObject: "index.html",
        domainNames: ["linkcheckr.bozapps.com"],
        certificate: acm.Certificate.fromCertificateArn(
          this,
          "Cert",
          certificateArn
        ),
      }
    );
    siteBucket.grantRead(oai);
    // === Outputs ===
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName,
      description: "Frontend URL",
    });

    new cdk.CfnOutput(this, "ApiURL", {
      value: api.url ?? "No URL",
      description: "Backend API URL",
    });
  }
}
