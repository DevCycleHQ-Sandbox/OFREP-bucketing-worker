import { FeatureType, VariableType, Variable, ConfigBody, AudienceOperator, FilterComparator, FilterType } from "@devcycle/types";

export const testConfig: ConfigBody<string> = {
    "project": {
        "_id": "2",
        "a0_organization": "testOrg",
        "key": "testProject",
        "settings": {
            "edgeDB": {
                "enabled": false
            }
        }
    },
    "environment": {
        "_id": "3",
        "key": "testEnvironment"
    },
    "features": [
        {
            "_id": "testFeature_id",
            "key": "testFeature",
            "variations": [
                {
                    "key": "default",
                    "name": "Default",
                    "_id": "default",
                    "variables": [
                        {
                            "_var": "testvariable_id",
                            "value": {
                                "type": VariableType.boolean,
                                "value": true
                            }
                        }
                    ]
                }
            ],
            "type": FeatureType.release,
            "configuration": {
                "_id": "testFeature_config_id",
                "targets": [
                    {
                        "_id": "1",
                        "_audience": {
                            "_id": "",
                            "filters": {
                                "operator": AudienceOperator.and,
                                "filters": [{
                                    "type": FilterType.all,
                                    "comparator": FilterComparator['='],
                                    "values": [],
                                }]
                            }
                        },
                        "distribution": [{
                            "_variation": "default",
                            "percentage": 1
                        }],
                    }
                ]
            }
        }
    ],
    "variables": [
        {
            "_id": "testvariable_id",
            "key": "testvariable",
            "type": VariableType.boolean
        }
    ],
    "variableHashes": {}
}