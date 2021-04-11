# Serverless Nodejs Example for structuring for large scale application

This repo takes an example of multi tenant ecommerce application to show the structure.

Architectural pattern some are taken by [Serverless Doc](https://www.serverless.com/blog/structuring-a-real-world-serverless-app).

Note: This repo not with code complete, but shown with somehow to show the pattern can be followed for best approach.

Implemented with basic authentication(custom cognito authorizer function), user signup, signin, seller signup and signin.

## Getting Started

To get started you can simply clone this `serverless-nodejs-example` repository and install the dependencies.

Clone the `serverless-nodejs-example` repository using git:

```bash
    git clone git@github.com:sandeep9738/serverless-nodejs-example.git
    cd serverless-nodejs-example
```

Install dependencies with this command:

```bash
npm install
```

Run the application in offline:

```bash
sls offline start --noAuth
```

To know about more command line options refer:
[Serverless Command Line Options](https://www.serverless.com/plugins/serverless-offline).

To deploy

```bash
sls deploy --aws-profile ${aws profile} --stage ${stage(dev, prod, devsandeep etc)} --config  ${filename}.yml
```

Always maintain AWS profiles as specified in the document
[AWS profiles maintaining guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

Since there multiple yml files makes sure, before deploying if there are any deplendencies for the current deployment yml file, those are deployed before this one.
For clear understanding read docs :
[Serverless First Deployment](https://www.serverless.com/blog/structuring-a-real-world-serverless-app).
-> scroll down to `First deployment`

## Tech Stack

- Nodejs 12.x
- Serverless-framework
