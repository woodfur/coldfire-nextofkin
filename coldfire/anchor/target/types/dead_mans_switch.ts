/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/dead_mans_switch.json`.
 */
export type DeadMansSwitch = {
  "address": "66r3Thkzo3KsaR3ToBzcEHmiyU5fRmAFxbxGAqLEQiUR",
  "metadata": {
    "name": "deadMansSwitch",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkIn",
      "discriminator": [
        209,
        253,
        4,
        217,
        250,
        241,
        207,
        50
      ],
      "accounts": [
        {
          "name": "switch",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "switch"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "createPlan",
      "discriminator": [
        77,
        43,
        141,
        254,
        212,
        118,
        41,
        186
      ],
      "accounts": [
        {
          "name": "plan",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "planType",
          "type": {
            "defined": {
              "name": "planType"
            }
          }
        },
        {
          "name": "beneficiaries",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "assets",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "distributionRules",
          "type": "string"
        },
        {
          "name": "activationConditions",
          "type": "string"
        }
      ]
    },
    {
      "name": "executeSwitch",
      "discriminator": [
        253,
        161,
        251,
        23,
        97,
        162,
        15,
        250
      ],
      "accounts": [
        {
          "name": "switch",
          "writable": true
        },
        {
          "name": "beneficiary",
          "writable": true,
          "signer": true,
          "relations": [
            "switch"
          ]
        },
        {
          "name": "owner",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "switch",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "beneficiary"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "switchDelay",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "deadMansSwitch",
      "discriminator": [
        208,
        207,
        203,
        146,
        95,
        145,
        200,
        93
      ]
    },
    {
      "name": "plan",
      "discriminator": [
        161,
        231,
        251,
        119,
        2,
        12,
        162,
        2
      ]
    }
  ],
  "events": [
    {
      "name": "checkedIn",
      "discriminator": [
        211,
        80,
        198,
        244,
        196,
        84,
        212,
        150
      ]
    },
    {
      "name": "planCreated",
      "discriminator": [
        215,
        11,
        135,
        121,
        208,
        119,
        149,
        149
      ]
    },
    {
      "name": "switchExecuted",
      "discriminator": [
        231,
        32,
        85,
        68,
        239,
        254,
        31,
        76
      ]
    },
    {
      "name": "switchInitialized",
      "discriminator": [
        134,
        59,
        228,
        132,
        128,
        185,
        32,
        114
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidSwitchDelay",
      "msg": "Switch delay must be greater than zero"
    },
    {
      "code": 6001,
      "name": "switchNotTriggered",
      "msg": "Not enough time has passed to execute the switch"
    },
    {
      "code": 6002,
      "name": "unauthorizedOwner",
      "msg": "Only the owner can check in"
    },
    {
      "code": 6003,
      "name": "unauthorizedBeneficiary",
      "msg": "Only the beneficiary can execute the switch"
    }
  ],
  "types": [
    {
      "name": "checkedIn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "deadMansSwitch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "beneficiary",
            "type": "pubkey"
          },
          {
            "name": "lastCheckIn",
            "type": "i64"
          },
          {
            "name": "switchDelay",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "plan",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "planType",
            "type": {
              "defined": {
                "name": "planType"
              }
            }
          },
          {
            "name": "beneficiaries",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "assets",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "distributionRules",
            "type": "string"
          },
          {
            "name": "activationConditions",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "planCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "planId",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "planType",
            "type": {
              "defined": {
                "name": "planType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "planType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "inheritance"
          },
          {
            "name": "emergency"
          },
          {
            "name": "business"
          }
        ]
      }
    },
    {
      "name": "switchExecuted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "beneficiary",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "amountTransferred",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "switchInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "beneficiary",
            "type": "pubkey"
          },
          {
            "name": "switchDelay",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
