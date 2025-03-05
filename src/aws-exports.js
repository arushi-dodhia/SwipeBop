const awsConfig = {
    Auth: {
        Cognito: {
            region: "us-east-2",
            userPoolId: "us-east-2_EqAsSgZv5",
            userPoolClientId: "3i6j5j8plc7j9of2dbtjjgjd0b",
            authenticationFlowType: "USER_PASSWORD_AUTH",
        }
    }
};

export default awsConfig;