exports.calcPublic = calc;

// Stack class
class Stack {
    // Array is used to implement stack
    constructor() {
        this.items = [];
    }
 
    // push(item)
    push(element) {
        // push element into the items
        this.items.push(element);
    }
    // pop()
    pop() {
        // return top most element in the stack
        // and removes it from the stack
        // false if stack is empty
        if (this.items.length == 0)
            return false;
        return this.items.pop();
    }
    // peek()
    peek() {
        // return the top most element from the stack
        // but does'nt delete it.
        return this.items[this.items.length - 1];
    }
    // isEmpty()
    isEmpty() {
        // return true if stack is empty
        return this.items.length == 0;
    }
    // printStack()
    printStack() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}

function calc() {
    let operatorStack = new Stack();
    let outQue = new Stack();
    const mathFunc = process.argv[2];

    // Remove extra spaces and replace the unicode minus sign with a regular hyphen
    const cleanedInput = mathFunc.replace(/\s+/g, ' ').replace(/−/g, '-');
    // Define a regular expression to match numbers, operators, and parentheses
    const tokenPattern = /(?:\d+(?:\.\d+)?|\+|\-|\×|\÷|\^|\(|\))/g;
    // Use the match function to find all matches in the input string
    const tokens = cleanedInput.match(tokenPattern);

    const numRegEx = /-?\d+(\.\d+)?/g;
    const funcRegEx = /[a-z]+\s*/gi;
    const opRegEx = /[\+\-\*\/\^]/g;
    const commaRegEx = /,/g;
    const leftParenRegEx = /\(/g;
    const rightParenRegEx = /\)/g;
    
    // while there are tokens to be read:
    while (tokens && tokens.length) {
        // read a token
        const elem = tokens.shift();
        if (elem.match(numRegEx)) {
            // - a number:
            //     put it into the output queue
            outQue.push(elem);
        } else if (elem.match(funcRegEx)) {
            // - a function:
            //     push it onto the operator stack 
            operatorStack.push(elem);
        } else if (elem.match(opRegEx)) {
            // - an operator o1:
            //     while (
            //         there is an operator o2 at the top of the operator stack which is not a left parenthesis, 
            //         and (o2 has greater precedence than o1 or (o1 and o2 have the same precedence and o1 is left-associative))
            //     ):
            //         pop o2 from the operator stack into the output queue
            //     push o1 onto the operator stack
        } else if (elem.match(commaRegEx)) {
            // - a ",":
            //     while the operator at the top of the operator stack is not a left parenthesis:
            //          pop the operator from the operator stack into the output queue 
        } else if (elem.match(leftParenRegEx)) {
            // - a left parenthesis (i.e. "("):
            //     push it onto the operator stack
        } else if (elem.match(rightParenRegEx)) {
            // - a right parenthesis (i.e. ")"):
            //     while the operator at the top of the operator stack is not a left parenthesis:
            //         {assert the operator stack is not empty}
            //         /* If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. */
            //         pop the operator from the operator stack into the output queue
            //     {assert there is a left parenthesis at the top of the operator stack}
            //     pop the left parenthesis from the operator stack and discard it
            //     if there is a function token at the top of the operator stack, then:
            //         pop the function from the operator stack into the output queue
        }

    }
    // /* After the while loop, pop the remaining items from the operator stack into the output queue. */
    // while there are tokens on the operator stack:
    //     /* If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses. */
    //     {assert the operator on top of the stack is not a (left) parenthesis}
    //     pop the operator from the operator stack onto the output queue
};
