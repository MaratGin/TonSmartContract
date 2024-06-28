import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { WordManager } from '../wrappers/WordManager';
import '@ton/test-utils';

describe('WordManager', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let wordManager: SandboxContract<WordManager>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        wordManager = blockchain.openContract(await WordManager.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await wordManager.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: wordManager.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and wordManager are ready to use
    });
});
