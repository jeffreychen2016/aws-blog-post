#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { BlogPostStack } from '../lib/blog-post-stack';

const app = new cdk.App();
new BlogPostStack(app, 'BlogPostStack');
