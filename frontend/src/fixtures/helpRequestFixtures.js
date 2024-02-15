const helpRequestFixtures = {
    oneRequest: {
        "requesterEmail": "bendover@ucsb.edu",
        "teamId": "s22-5pm-3",
        "tableOrBreakoutRoom": "7",
        "explanation": "Need help with Swagger-ui",
        "requestTime": "2022-01-02T12:00:00",
        "solved": false
    },
    threeRequests: [
        {
            "requesterEmail": "bendover@ucsb.edu",
            "teamId": "s22-5pm-3",
            "tableOrBreakoutRoom": "7",
            "explanation": "Need help with Swagger-ui",
            "requestTime": "2022-01-02T12:00:00",
            "solved": false
        },
        {
            "requesterEmail": "bendover2@ucsb.edu",
            "teamId": "s22-5pm-4",
            "tableOrBreakoutRoom": "8",
            "explanation": "Need more help with Swagger-ui",
            "requestTime": "2022-07-02T12:00:00",
            "solved": false
        },
        {
            "requesterEmail": "bendover3@ucsb.edu",
            "teamId": "s22-5pm-5",
            "tableOrBreakoutRoom": "9",
            "explanation": "Need even more help with Swagger-ui",
            "requestTime": "2022-10-02T12:00:00",
            "solved": true
        }
    ]
};


export { helpRequestFixtures };