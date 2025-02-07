import type {AWS} from '@serverless/typescript'

const serverlessConfiguration = {
    service: 'slickdeals-summarizer',
    frameworkVersion: '4',

    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        region: 'us-east-2',
        timeout: 60,
        environment: {
            NODE_ENV: 'production'
        },
        apiGateway: {
            apiKeys: [{
                name: 'slickdeals-api-key',
                value: 'Mg5jiJmrPM5XUeUmLxvIl2akM8y6wivx9c6lJjAT'
            }],
            usagePlan: {
                quota: {
                    limit: 500,
                    period: 'DAY'
                },
                throttle: {
                    burstLimit: 15,
                    rateLimit: 10
                }
            }
        }
    },

    plugins: ['serverless-dotenv-plugin', 'serverless-offline'],

    custom: {
        esbuild: {
            watch: {
                pattern: 'src/**/*.ts'
            },
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10
        }
    },

    functions: {
        summarize: {
            handler: 'src/handler.summarize',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'summarize',
                        private: true,
                        request: {
                            parameters: {
                                querystrings: {
                                    url: true
                                }
                            }
                        },
                        cors: true
                    }
                }
            ]
        }
    },

    package: {
        individually: true
    }
} as AWS

module.exports = serverlessConfiguration
