import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { CompleteWord, NewWord, TaskSmartContract } from '../wrappers/TaskSmartContract';
import '@ton/test-utils';
import { WordChild } from '../wrappers/WordChild';

describe('TaskSmartContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let taskSmartContract: SandboxContract<TaskSmartContract>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        taskSmartContract = blockchain.openContract(await TaskSmartContract.fromInit(45366n));
        // wordParent = blockchain.openContract{await TaskSmartContract.fromInit}
       
        deployer = await blockchain.treasury('deployer');

        const deployResult = await taskSmartContract.send(
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
            to: taskSmartContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and taskSmartContract are ready to use
    });

    it('should take some coins', async () => {
        const isGuessed = await taskSmartContract.getGetGuess()
        const balanceBefore = await taskSmartContract.getBalance()

        console.log("isGuessedBefore - ", isGuessed)
        console.log("Balance before - ", balanceBefore)
        console.log("sender balance before - ", balanceBefore)


       const res =  await taskSmartContract.send(
            deployer.getSender(), {
                value: toNano("20.0")
            },
            'солнце'
        )

        const isGuessedAfter = await taskSmartContract.getGetGuess()
        console.log("isGuessedAfter - ", isGuessedAfter);
        console.log("events - ", res.events.length);
        const balanceAfter = await taskSmartContract.getBalance()
        console.log("balance after - ", balanceAfter);

        expect(isGuessed).toBeTruthy
        // the check is done inside beforeEach
        // blockchain and taskSmartContract are ready to use
    });

    it('should send that guess is incorrect', async () => {
        const isGuessed = await taskSmartContract.getGetGuess()
        const balanceBefore = await taskSmartContract.getBalance()

        console.log("isGuessedBefore - ", isGuessed)
        console.log("Balance before - ", balanceBefore)
        const balanceBeforeDeployer = await deployer.getBalance();
        console.log("sender balance before - ", balanceBeforeDeployer)


       const res =  await taskSmartContract.send(
            deployer.getSender(), {
                value: toNano("20.0")
            },
            'dffds'
        )

        const isGuessedAfter = await taskSmartContract.getGetGuess()
        console.log("isGuessedAfter - ", isGuessedAfter);
        console.log("events - ", res.events.length);
        const balanceAfter = await taskSmartContract.getBalance();
        const balanceAfterDeployer = await deployer.getBalance();
        console.log("balance after - ", balanceAfterDeployer);
        console.log("sender balance after - ", deployer.getBalance);
        const result = await res.events;
        console.log(result); 

        expect(isGuessed).toBeFalsy
    });

    it('should create child', async () => {

        const balanceBefore0 = await taskSmartContract.getBalance()
        console.log("Balance before - ", balanceBefore0)
        const message: NewWord = {
            $$type: 'NewWord',
            word: "Малина"
        }
        await taskSmartContract.send(deployer.getSender(), {
            value: toNano("0.7")
        }, message);
        const wordChildAddr = await taskSmartContract.getWordChild(1n);
        const wordChild = blockchain.openContract(WordChild.fromAddress(wordChildAddr));
        const details = await wordChild.getDetails();
        console.log("details - ", details)
        const balanceBefore = await deployer.getBalance()
        console.log("Balance before - ", balanceBefore)
        const wordComplete: CompleteWord = {
            $$type: 'CompleteWord',
            seqno: 1n,
            guess: "Малина"
        }
        await taskSmartContract.send(deployer.getSender(), {
            value: toNano("0.1")
        }, wordComplete)
        const details2 = await wordChild.getDetails();

        console.log("details - ", details2)

        const balanceAfterDeployer = await deployer.getBalance();
        console.log("balance after - ", balanceAfterDeployer - balanceBefore);
        const smBalance = await taskSmartContract.getBalance()
        console.log("Smart contract balance - ",smBalance);

    })

    it('should get money if incorrect', async () => {
        console.log("777");

        const balanceBefore0 = await taskSmartContract.getBalance()
        console.log("Balance before - ", balanceBefore0)
        const message: NewWord = {
            $$type: 'NewWord',
            word: "Малина"
        }
        await taskSmartContract.send(deployer.getSender(), {
            value: toNano("0.7")
        }, message);

        const smBalance = await taskSmartContract.getBalance()
        console.log("Smart contract balance - ",smBalance);


        const wordComplete: CompleteWord = {
            $$type: 'CompleteWord',
            seqno: 1n,
            guess: "Маrина"
        }
        await taskSmartContract.send(deployer.getSender(), {
            value: toNano("20.1")
        }, wordComplete)

        const smBalance1 = await taskSmartContract.getBalance()
        console.log("Smart contract balance after - ", smBalance1);
        const bounce = await taskSmartContract.getCheckIsBounced()
        console.log("Bounce - ", bounce);
        // the check is done inside beforeEach
        // blockchain and taskSmartContract are ready to use
    })
    it('should withdraw', async () => {

        const balanceBefore = await deployer.getBalance()
        console.log("Balance before - ", balanceBefore)

        await taskSmartContract.send(deployer.getSender(), {
            value: toNano("20.0")
        }, "query");

        const balanceBefore0 = await taskSmartContract.getBalance()
        console.log("Balance smartCont - ", balanceBefore0)

        const res =  await taskSmartContract.send(
            deployer.getSender(), {
                value: toNano("20.0")
            },
            'withdraw'
        )

        // const balanceAfterDeployer = await deployer.getBalance();
        // console.log("balance after - ", balanceAfterDeployer - balanceBefore);
        const smBalance = await taskSmartContract.getBalance()
        console.log("Balance smartCont After - ", smBalance)


        // const balanceBefore0 = await taskSmartContract.getBalance()
        // console.log("Balance before - ", balanceBefore0)
        // const message: NewWord = {
        //     $$type: 'NewWord',
        //     word: "Малина"
        // }
        // await taskSmartContract.send(deployer.getSender(), {
        //     value: toNano("0.7")
        // }, message);
      
        // the check is done inside beforeEach
        // blockchain and taskSmartContract are ready to use
    })

    // it('should complete word', async () => {
    //     const message: NewWord = {
    //         $$type: 'NewWord',
    //         word: "Малина"
    //     }
    //     await taskSmartContract.send(deployer.getSender(), {
    //         value: toNano("0.5")
    //     }, message);
    //     const wordChildAddr = await taskSmartContract.getWordChild(1n);
    //     const wordChild = blockchain.openContract(WordChild.fromAddress(wordChildAddr));
    //     const details = await wordChild.getDetails();
    //     console.log("details - ", details)
    //     // the check is done inside beforeEach
    //     // blockchain and taskSmartContract are ready to use
    // })
});



