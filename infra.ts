#!/usr/bin/env node
require('source-map-support/register');

import { Construct } from 'constructs'
import { App, Stack, type StackProps } from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AppType, FullStackConstruct, AppGrant } from '@fy-stack/fullstack-construct';
import * as path from 'path';

interface AppProps extends StackProps {
  ownerArn?: string
}

const appId = process.env.AWS_APP_ID ?? "fast-pro";


if (!appId) throw new Error('App ID is missing');

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id, props);

    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

    const app = new FullStackConstruct(this, 'FullStackApp', {
      appId: `${props.stackName}-fullstack`,
      apps: {
        api: {
          type: AppType.NODE_API,
          output: path.join(process.cwd(), 'dist/apps/api'),
          buildParams: { cmd: 'node main.js' },
          attachment: { secrets: true, database: true },
          grant: [AppGrant.SECRETS, AppGrant.DATABASE, AppGrant.EVENT],
        },
      },
      secrets: {
        REDIS_URL: process.env.REDIS_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        SECRET_KEY: process.env.SECRET_KEY
      },
      api: {
        routes: { '/*': { $resource: 'api' } },
      },
    });

    const sesIdentity = ses.EmailIdentity.fromEmailIdentityName(
      this,
      'EmailIdentity',
      'fastpro.com'
    );

    const sesConfig = ses.ConfigurationSet.fromConfigurationSetName(
      this,
      'EmailConfigSet',
      'fastpro'
    );

    if (app.apps && app.apps.api && app.apps.api.function) {
      sesIdentity.grantSendEmail(app.apps.api.function);

      app.apps.api.function.addToRolePolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ses:SendEmail'],
          resources: [
            'arn:aws:ses:' +
            region +
            ':' +
            account +
            ':configuration-set/' +
            sesConfig.configurationSetName,
          ],
        })
      );
    }

  }
}
const app = new App();
new AppStack(app, 'app', { env, stackName: appId });
