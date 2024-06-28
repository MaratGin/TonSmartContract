import { toNano } from '@ton/core';
import { WordManager } from '../wrappers/WordManager';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const wordManager = provider.open(await WordManager.fromInit());

    await wordManager.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(wordManager.address);

    // run methods on `wordManager`
}
