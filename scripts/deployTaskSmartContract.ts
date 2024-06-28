import { toNano } from '@ton/core';
import { TaskSmartContract } from '../wrappers/TaskSmartContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const taskSmartContract = provider.open(await TaskSmartContract.fromInit(23432n));

    await taskSmartContract.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(taskSmartContract.address);

    // run methods on `taskSmartContract`
}
