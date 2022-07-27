//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const { expect, assert } = require("chai");

const wasm_tester = require("circom_tester").wasm;


const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const { BigNumber } = require("ethers");
const { buildPoseidon } = require("circomlibjs");

const poseidon = async(inp) => {
      let hashed= await buildPoseidon();
      return BigNumber.from(hashed.F.toObject(hashed(inp)));
    }

    describe("Mastermind variation circuit test", () => {
        it("Should give 1 hit and 1 blow", async () => {
            const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
    
            
            const solution = ["1" ,"2", "3", "4", "5", "69"];
            const solutionHash = await poseidon(solution);
    
            const INPUT = {
                "pubGuessA": "1",
                "pubGuessB": "3",
                "pubGuessC": "8",
                "pubGuessD": "7",
                "pubGuessE": "9",
                "pubNumHit": "1",
                "pubNumBlow": "2",
                "pubSolnHash": solutionHash,
                "privSolnA": solution[0],
                "privSolnB": solution[1],
                "privSolnC": solution[2],
                "privSolnD": solution[3],
                "privSolnE": solution[4],
                "privSalt": solution[5],
            };
    
            const witness = await circuit.calculateWitness(INPUT, true);
    
            assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
            assert(Fr.eq(Fr.e(witness[1]), Fr.e(solutionHash)));
        });

        it("Should give 5 hits", async () => {
            const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
    
            
            const solution = ["1" ,"2", "3", "4", "5", "69"];
            const solutionHash = await poseidon(solution);
    
            const INPUT = {
                "pubGuessA": "1",
                "pubGuessB": "2",
                "pubGuessC": "3",
                "pubGuessD": "4",
                "pubGuessE": "5",
                "pubNumHit": "5",
                "pubNumBlow": "0",
                "solHash": solutionHash,
                "privSolnA":  solution[0],
                "privSolnB":  solution[1],
                "privSolnC":  solution[2],
                "privSolnD":  solution[3],
                "privSolnE":  solution[4],
                "privSalt":  solution[5],
            };
    
            const witness = await circuit.calculateWitness(INPUT, true);
    
            assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
            assert(Fr.eq(Fr.e(witness[1]), Fr.e(solutionHash)));
        });

        
    
    });