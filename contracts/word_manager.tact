import "@stdlib/deploy";

message Reach {
    task: Address;
    target: Bool;
}

contract WordManager with Deployable {
    target: Int as Bool;


    init() {
        self.target = false;
        
    }
    
    // send Guess
    receive(msg: Reach) {
        self.target = msg.target;
        send(SendParameters {
            to: msg.task,
            value: "word",
            mode: SendRemainingValue + SendIngoreErrors,
            body: "word".asComment()
        })
    }

    // check
    receive(msg: WordReply) {
        if (self.target == true)
    }
}
