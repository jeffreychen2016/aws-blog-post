#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { BlogPostStack } from "../lib/blog-post-stack";

const app = new cdk.App();
// fill in your aws account
const env = { account: "", region: "us-east-1" };
new BlogPostStack(app, "BlogPostStack", { env });
