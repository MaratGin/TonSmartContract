import { Address, toNano } from '@ton/core';
import { CompleteWord, TaskSmartContract } from '../wrappers/TaskSmartContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const taskSmartContract = provider.open(await TaskSmartContract.fromInit(45366n));

    const currentWord = await taskSmartContract.getCurWord()
    
    console.log("Current Word - ", currentWord)
    const wordComplete: CompleteWord = {
            $$type: 'CompleteWord',
            seqno: 1n,
            guess: "Малина"
        }
        await taskSmartContract.send(provider.sender(), {
            value: toNano("0.3")
        }, wordComplete)
    // run methods on `taskSmartContract`
}
