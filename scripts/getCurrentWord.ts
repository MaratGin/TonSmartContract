import { toNano } from '@ton/core';
import { TaskSmartContract } from '../wrappers/TaskSmartContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const taskSmartContract = provider.open(await TaskSmartContract.fromInit(45366n));
    const currentWord = await taskSmartContract.getCurWord()
    console.log("Current Word - ", currentWord)

    // run methods on `taskSmartContract`
}
