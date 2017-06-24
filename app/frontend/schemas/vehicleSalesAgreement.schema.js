export default {
    title: "Vehicle Sales Agreement",
    description: "Proposal for vehicle sales agreement",
    type: "object",
    properties: {

        date: {
            description: 'Agreement Date',
            type: 'date'
        },
        buyer: {
            description: 'Buyer',
            type: 'string'
        },
        seller: {
            description: 'Seller',
            type: 'string'
        },
        dav: {
            type: "object",
            description: "Description of Acquired Vehicle",
            properties: {
                make: {
                    type: 'string',
                    description: 'Make'
                },
                model: {
                    type: 'string',
                    description: 'Model'
                },
                bodyType: {
                    type: 'string',
                    description: 'Body Type'
                },
                bodyColor: {
                    type: 'string',
                    description: 'Body Color'
                },
                year: {
                    type: 'string',
                    description: 'Year'
                },
                miles: {
                    type: 'string',
                    description: 'Miles'
                },
                vin: {
                    type: 'string',
                    description: 'Vehicle Identification Number'
                }
            }
        },
        cons: {
            type: "object",
            description: "Consideration",
            properties: {
                price: {
                    type: 'number',
                    description: 'Price'
                }
            }
        },

        required: []
    }


}