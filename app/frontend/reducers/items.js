
export default function items(state = {
    list: [
        {
            "iss": "https://authority.com",
            "sub": "https://subject.com",
            "iat": "2017-06-13T00:00:00+00:00",
            "exp": "2018-06-13T00:00:00+00:00",
            "atr": {
                "name": "Sample Signed",
                "payload": [
                    {
                        "meta": {
                            type: "text"
                        },
                        "comment": "This is a signed statement"
                    },
                    {
                        "meta": {
                            type: "file",
                            name: "TestFile.pdf"
                        }
                    }
                ],
                "signatures": [
                    {
                        "protected": {
                            "iss": "https://subject.com",
                            "alg": "RS256",
                            "typ": "JWS",
                            "kid": "mykey"
                        },
                        "signature": "ZNYWm1SsmYUDzZOi8EHxNAnIuco1tTOR0iCpmZihXbufJkScJXq_tVpt2Vaw_GdsFJ4bvVp8bXkrwBqTSiSJ_6235ho4l84a79WRikTNvDOsNht203otqVBQmyvuvRqPTsXoQ--lQPVMclvHvsxEz5sq_mPzJJ3GKTPFclSr_ehniPIpP3T9GB3HQMdDNpqwaTiTpkFrr2y-8KmmoPI0IJJe-iTquJF2e8VQT8PTrK683dP8tbSbq971LA4EuZi__jG5-icYKBvv8uPenlh0ctcb8nDWSVsugTQV-ekdb_0dfoOO8PO_EjvmQsWfN0WBBGSJXfu52yQAWsOXmwAhWCwrqq5rAMF8mW0gk6iCVL80R_UzNeCIjVh_Zd6_BhvKqjAwNDdwT71caPN5eJFMbYnNrA_b_Tg7BZH97MrL9U6vqX3yK-NTN7xYCHHaFZje2gqJ6-REI1wDNQY5g3TZVf9TUlb0A1SXoh4WVgFFnnejlHH-KXLgduMqbxwLFVPa1XReIvTGdxAwxVVM_fuHaZfsrGH5KllYhmqoKv6ij5n9o-7P84Qodpv_2AoP7OJ67NTa6CjUbHKHx39aZDZP7GHIFiIKgAl5bdaxEDvorwSwP5BTvLXZCQIK0D0cv-iocWHBcdqDfCcYAUhFvWn4BsnL8Vd-3tNacVZFnVYt9FM"
                    }
                ]
            }
        },
        {
            "iss": "https://authority.com",
            "sub": "https://subject.com",
            "iat": "2017-06-13T00:00:00+00:00",
            "exp": "2018-06-13T00:00:00+00:00",
            "atr": {
                "name": "Sample Image Signed",
                "payload": [
                    {
                        "meta": {
                            type: "text"
                        },
                        "comment": "This is a signed statement"
                    },
                    {
                        "meta": {
                            type: "file",
                            name: "page1.png"
                        }
                    }
                ],
                "signatures": [
                    {
                        "protected": {
                            "iss": "https://subject.com",
                            "alg": "RS256",
                            "typ": "JWS",
                            "kid": "mykey"
                        },
                        "signature": "ZNYWm1SsmYUDzZOi8EHxNAnIuco1tTOR0iCpmZihXbufJkScJXq_tVpt2Vaw_GdsFJ4bvVp8bXkrwBqTSiSJ_6235ho4l84a79WRikTNvDOsNht203otqVBQmyvuvRqPTsXoQ--lQPVMclvHvsxEz5sq_mPzJJ3GKTPFclSr_ehniPIpP3T9GB3HQMdDNpqwaTiTpkFrr2y-8KmmoPI0IJJe-iTquJF2e8VQT8PTrK683dP8tbSbq971LA4EuZi__jG5-icYKBvv8uPenlh0ctcb8nDWSVsugTQV-ekdb_0dfoOO8PO_EjvmQsWfN0WBBGSJXfu52yQAWsOXmwAhWCwrqq5rAMF8mW0gk6iCVL80R_UzNeCIjVh_Zd6_BhvKqjAwNDdwT71caPN5eJFMbYnNrA_b_Tg7BZH97MrL9U6vqX3yK-NTN7xYCHHaFZje2gqJ6-REI1wDNQY5g3TZVf9TUlb0A1SXoh4WVgFFnnejlHH-KXLgduMqbxwLFVPa1XReIvTGdxAwxVVM_fuHaZfsrGH5KllYhmqoKv6ij5n9o-7P84Qodpv_2AoP7OJ67NTa6CjUbHKHx39aZDZP7GHIFiIKgAl5bdaxEDvorwSwP5BTvLXZCQIK0D0cv-iocWHBcdqDfCcYAUhFvWn4BsnL8Vd-3tNacVZFnVYt9FM"
                    }
                ]
            }
        }
        ,
        {
            "iss": "https://authority.com",
            "sub": "https://subject.com",
            "iat": "2017-06-13T00:00:00+00:00",
            "exp": "2018-06-13T00:00:00+00:00",
            "atr": {
                "name": "Sample Image Unsigned",
                "payload": [
                    {
                        "meta": {
                            type: "file",
                            name: "page2.png"
                        }
                    }
                ]
            }
        }
    ]
}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

