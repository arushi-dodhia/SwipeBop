const awsConfig = {
    Auth: {
        Cognito: {
            region: "us-east-2",
            userPoolId: "us-east-2_8cr6IBY3M",
            userPoolClientId: "85q1ulv7t8ivq7g9p7ioivdqs",
            mandatorySignIn: false,
            authenticationFlowType: "USER_PASSWORD_AUTH",
            loginWith: {
                oauth: {
                    domain: "us-east-28cr6iby3m.auth.us-east-2.amazoncognito.com",
                    scope: ["email", "openid"],
                    redirectSignIn: ["http://localhost:3000/"],
                    redirectSignOut: ["http://localhost:3000/"],
                    responseType: "code",
                },
            }
        }
    }
};

export default awsConfig;