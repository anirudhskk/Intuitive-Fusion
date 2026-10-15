import { App, Tags } from 'aws-cdk-lib';
import { AnalyticsStack } from '../lib/analytics-stack.js';
import { AppStack } from '../lib/app-stack.js';
import { DataStack } from '../lib/data-stack.js';
import { IdentityStack } from '../lib/identity-stack.js';
import { NetworkStack } from '../lib/network-stack.js';
import { SecurityStack } from '../lib/security-stack.js';

/**
 * One deployment = one stage in one nominated region. Customers electing a specific national
 * region, or their own AWS account (enterprise-hosted / hybrid — open decision), get their own
 * deployment so data never leaves their boundary (NFR-R01, NFR-R02, SEC-D09, SEC-D11).
 */
const app = new App();
const stage = String(app.node.tryGetContext('stage') ?? 'dev');
const region = String(app.node.tryGetContext('region') ?? 'ap-southeast-2');
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region };
const name = (s: string) => `IF-${stage}-${s}`;

const network = new NetworkStack(app, name('Network'), { env });
const security = new SecurityStack(app, name('Security'), { env, stage });
const identity = new IdentityStack(app, name('Identity'), { env, stage });
const data = new DataStack(app, name('Data'), { env, stage, vpc: network.vpc, keys: security.keys });
new AppStack(app, name('App'), { env, stage, vpc: network.vpc, data, identity, keys: security.keys });
new AnalyticsStack(app, name('Analytics'), { env, stage, keys: security.keys });

Tags.of(app).add('project', 'intuitive-fusion');
Tags.of(app).add('stage', stage);
