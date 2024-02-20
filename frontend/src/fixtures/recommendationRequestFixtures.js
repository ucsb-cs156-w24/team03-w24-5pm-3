const recommendationRequestFixtures = {
    oneRecommendationRequest:
    [
      {
  "id": 1,
        "requesterEmail": "stu1@ucsb.edu",
        "professorEmail": "prof1@ucsb.edu",
          "explanation": "BS/MS",
          "dateRequested": "2022-01-03T00:00:00",
          "dateNeeded": "2022-03-11T00:00:00",
          "done": "false"
      }
    ],

    threeRecommendationRequests:
    [
        {
            "id": 2,
            "requesterEmail": "stu2@ucsb.edu",
            "professorEmail": "prof2@ucsb.edu",
            "explanation": "BS/MS in CS",
            "dateRequested": "2022-01-03T00:00:00",
            "dateNeeded": "2022-03-11T00:00:00",
            "done": "false"
        },

        {
            "id": 3,
            "requesterEmail": "stu3@ucsb.edu",
            "professorEmail": "prof3@ucsb.edu",
            "explanation": "Masters at MIT",
            "dateRequested": "2022-01-03T00:00:00",
            "dateNeeded": "2022-03-11T00:00:00",
            "done": "true"
        },

        {
            "id": 4,
            "requesterEmail": "stu4@ucsb.edu",
            "professorEmail": "prof4@ucsb.edu",
            "explanation": "PhD at UNC",
            "dateRequested": "2022-01-03T00:00:00",
            "dateNeeded": "2022-03-11T00:00:00",
            "done": "false"
        },
        
    ]
};

export { recommendationRequestFixtures };