import "@stdlib/deploy";
import "@stdlib/ownable";
import "./word_child";

message WordReply {
    isCorrect: Bool;
}

message Withdraw {
    amount: Int as coins;
}

message CompleteWord {
    seqno: Int as uint256;
    guess: String;
}

message NewWordResponse {
    result: String;
}
message NewWord {
    word: String;
}

// message InternalSetWord{
//     word: String;
// }


struct Word {
    word: String;
}

contract TaskSmartContract with Deployable, Ownable {
    ID: Int as uint32;
    counter: Int as uint32; 
    isBounced: Bool = false;
    title: String;
    owner: Address;
    currentWord: String = "Машина";
    numChilds: Int as uint256 = 0;
    currKey: Int as uint32;
    isGuessed: Bool;
    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years
    deployer: Address;

    init(ID: Int) {
        self.ID = ID;
        self.owner = sender();
        self.deployer = sender();
        self.isGuessed = false;
        // self.currKey = randBetween(0, 4);
        // self.currKey = random(0,4);
        self.currKey = 0;
        let sb: StringBuilder = beginString();
        sb.append("ABC");
        self.title = sb.toString();
        self.counter = 0;
    }

    receive("increment") {
        self.counter = self.counter + 1;
    }

    receive("query") {

    }


      get fun compareStrings(str1: String, str2: String) : Bool {
        // Используем оператор сравнения ==
        let bol1: Bool = false;
        let bol2: Bool = true;

        let hashed1: Int = str1.asSlice().hash();
        let hashed2: Int = str2.asSlice().hash();
        if ( hashed1 == hashed2) {
            return true;
        } else  {
            return false;
        }
        // return (str1 == str2);
    }

    // reply
    receive(title: String) {
        let word: String  = self.currentWord;
        if (self.compareStrings(word, title)) {
            // let value: Int = winBalance();
            send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value,
            mode: SendIgnoreErrors + SendRemainingValue,
            body: WordReply{isCorrect: true}.toCell()
        });
        self.reply(NewWordResponse{result: "Successfully guessed word"}.toCell());
        self.isGuessed = true;
        } else {
                        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendIgnoreErrors,
            body: "False".asComment()
        });
        self.reply(NewWordResponse{result: "Incorrect guess"}.toCell());
        self.isGuessed = false;
        }
    }

    receive("withdraw all") {
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive("withdraw"){
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }

    receive(msg: Withdraw) {
        // require(msg.amount > ton("0.2"), "Need minimum of 0.2 TON for request");
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        require(amount > 0, "Insufficient balance");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: amount,
            mode: SendIgnoreErrors
        });
    }

    receive (msg: NewWord) {
        require(sender() == self.deployer, "Only owner is allowed to create word");
        self.numChilds = self.numChilds + 1;
        let init: StateInit = initOf WordChild(myAddress(), self.numChilds, msg.word);
        self.currentWord = msg.word;
        send(SendParameters{
            to: contractAddress(init),
            body: InternalSetWord{word: msg.word}.toCell(),
            value: ton("0.2"),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data
    });
    self.reply(NewWordResponse{result: "Successfully added new word"}.toCell());
    }

    receive(msg: CompleteWord) {
        // require(sender() == self.deployer, "Only owner is allowed to complete word");
        send(SendParameters{
            to: contractAddress(initOf WordChild(myAddress(), self.numChilds, msg.guess)),
            body: InternalComplete{excess: sender()}.toCell(),
            value: myBalance() - ((myBalance() - self.MinTonForStorage) / 3),
            mode: SendIgnoreErrors
        });
        // self.reply(NewWordResponse{result: "Successfully guessed word"}.toCell());
    }
    bounced(src: bounced<CompleteWord>) {
        self.isBounced = true;
        //     send(SendParameters{
        //     to: contractAddress(initOf WordChild(myAddress(), self.numChilds, src.guess)),
        //     body: InternalComplete{excess: sender()}.toCell(),
        //     value: 0,
        //     mode: SendIgnoreErrors
        // });


    }

    // bounced() {

    // }

 
    get fun checkIsBounced(): Bool {
        return self.isBounced;
    }
    get fun randBetween(from: Int, to: Int): Int {
        return random(from, to);
    }

    get fun winBalance(): Int {
        return myBalance() - ((myBalance() - self.MinTonForStorage) / 3);
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }

    get fun getGuess(): Bool {
        return self.isGuessed;
    }

    get fun counter(): Int {
        return self.counter;
    }
    
    get fun numTodos(): Int {
        return self.numChilds;
    }
    get fun curWord(): String {
        return self.currentWord;
    }
    get fun wordChild(seqno: Int): Address {
        return contractAddress(initOf WordChild(myAddress(), seqno, self.currentWord));
    }
}
