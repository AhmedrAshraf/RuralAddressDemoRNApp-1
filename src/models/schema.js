export const schema = {
    "models": {
        "RuralAddress": {
            "name": "RuralAddress",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "latitude": {
                    "name": "latitude",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "longitude": {
                    "name": "longitude",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "stateCity": {
                    "name": "stateCity",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "RuralAddresses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "RuralAddressesByStateCity",
                        "fields": [
                            "stateCity"
                        ],
                        "queryField": "RuralAddressesByStateCity"
                    }
                }
            ]
        }
    },
    "enums": {},
    "nonModels": {},
    "version": "8b57d3f7a0103a3a59ae0362ba1544c7"
};