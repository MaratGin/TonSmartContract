import "@stdlib/deploy";
// import "@"

message InternalSetWord{
    word: String;
}
message InternalComplete {
    excess: Address;
}

struct WordDetail {
    word: String;
    isGuessed: Bool;
}

contract WordChild with Deployable {
    parent: Address;
    seqno: Int as uint256;
    word: String;
    isGuessed: Bool = false;


    init(parent: Address, seqno: Int, word: String) {
        self.parent = parent;
        self.seqno = seqno;
        self.word = word;
    }

    receive(msg: InternalSetWord) {
        require(sender() == self.parent, "Parent Only");
        // self.word = msg.word;
    }

    receive(msg: InternalComplete) {
        require(sender() == self.parent, "Parent Only");
        self.isGuessed = true;
        send(SendParameters{
            to: msg.excess,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    get fun details(): WordDetail {
        return WordDetail{word: self.word, isGuessed: self.isGuessed};
    }

}
