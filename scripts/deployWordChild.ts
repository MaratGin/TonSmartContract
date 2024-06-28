import { toNano } from '@ton/core';
import { WordChild } from '../wrappers/WordChild';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const wordChild = provider.open(await WordChild.fromInit());

    await wordChild.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(wordChild.address);

    // run methods on `wordChild`
}
