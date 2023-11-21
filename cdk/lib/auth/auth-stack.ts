import { Stack } from 'aws-cdk-lib';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface AuthStackProps {
  readonly applicationName: string;
}

export class AuthStack extends Stack {
  readonly identityPool: CfnIdentityPool;
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id);

    const { applicationName } = props;

    this.userPool = new UserPool(this, 'UserPool', {
      signInCaseSensitive: false,
    });

    this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
    });

    this.identityPool = new CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    const authenticatedRole = new Role(this, 'AuthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    // IoT CloudWatch Access
    authenticatedRole.addToPolicy(
      new PolicyStatement({
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'cloudwatch:namespace': applicationName,
          },
        },
      }),
    );

    // IoT Data Access
    authenticatedRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'iottwinmaker:ExecuteQuery',
          'iottwinmaker:ListWorkspaces',
          'iotsitewise:DescribeAsset',
          'iotsitewise:ListAssets',
          'iotsitewise:ListAssociatedAssets',
          'iotsitewise:DescribeAssetProperty',
          'iotsitewise:GetAssetPropertyValue',
          'iotsitewise:GetAssetPropertyValueHistory',
          'iotsitewise:GetAssetPropertyAggregates',
          'iotsitewise:BatchGetAssetPropertyAggregates',
          'iotsitewise:BatchGetAssetPropertyValue',
          'iotsitewise:BatchGetAssetPropertyValueHistory',
          'iotsitewise:ListAssetRelationships',
          'iotsitewise:DescribeAssetModel',
          'iotsitewise:ListAssetModels',
          'iotsitewise:ListTimeSeries',
          'iotevents:DescribeAlarmModel',
          'iotevents:ListTagsForResource',
        ],
        resources: ['*'],
      }),
    );

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });
  }
}
