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

    //regex
    const numRegEx = /-?\d+(\.\d+)?/g;
    const funcRegEx = /[a-z]+\s*/gi;
    const opRegEx = /[\+\-\*\/\^\×\÷]/g;
    const commaRegEx = /,/g;
    const leftParenRegEx = /\(/g;
    const rightParenRegEx = /\)/g;

    //operator associations and precendence
    const assoc = {  "^" : "right",  "*" : "left",  "/" : "left",  "÷": "left", "×": "left", "+" : "left",  "-" : "left" };
    const prec = {  "^" : 4,  "*" : 3,  "/" : 3, "÷": 3, "×": 3, "+" : 2,  "-" : 2 };
    
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
            //a. while there is an Operator token o at the top of the operator stack and either t is left-associative 
            // and has precedence is less than or equal to that of o, or t is right associative, and has precedence less
            // than that of o
            while(operatorStack.peek() && (assoc[elem] === 'left' && prec[elem] <= prec[operatorStack.peek()]) || (assoc[elem] === 'right' && prec[elem] < prec[operatorStack.peek()])) {
                //pop o off the operator stack, onto the output queue;
                outQue.push(operatorStack.pop());
            }
            // b. at the end of iteration push t onto the operator stack.
            operatorStack.push(elem);
        } else if (elem.match(commaRegEx)) {
            // - a ",":
            //     while the operator at the top of the operator stack is not a left parenthesis:
            while(!operatorStack.peek().match(leftParenRegEx)) {
                // pop the operator from the operator stack into the output queue
                outQue.push(operatorStack.pop());
            }
        } else if (elem.match(leftParenRegEx)) {
            // - a left parenthesis (i.e. "("): push it onto the operator stack
            operatorStack.push(elem)
        } else if (elem.match(rightParenRegEx)) {
            // - a right parenthesis (i.e. ")"):
            //     while the operator at the top of the operator stack is not a left parenthesis:
            //         {assert the operator stack is not empty}
            while(!operatorStack.peek().match(leftParenRegEx)) {
                // /* If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. */
                if (operatorStack.isEmpty()) throw Error('Mismatched parenthesis. Input invalid.');
                // pop the operator from the operator stack into the output queue
                outQue.push(operatorStack.pop());
            }   
            // {assert there is a left parenthesis at the top of the operator stack}
            if (operatorStack.peek().match(leftParenRegEx)) {
                // pop the left parenthesis from the operator stack and discard it
                operatorStack.pop();
            } else if (operatorStack.peek().match(funcRegEx)) {
                // if there is a function token at the top of the operator stack, then:
                // pop the function from the operator stack into the output queue
                outQue.push(operatorStack.pop());
            }
        }
    }
    // /* After the while loop, pop the remaining items from the operator stack into the output queue. */
    // while there are tokens on the operator stack:
    while(!operatorStack.isEmpty()) {
        // /* If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses. */
        // {assert the operator on top of the stack is not a (left) parenthesis}
        if (operatorStack.peek().match(leftParenRegEx) || operatorStack.peek().match(rightParenRegEx)) throw Error('Mismatched parenthesis. Input invalid.');
        // pop the operator from the operator stack onto the output queue
        outQue.push(operatorStack.pop());
    }
    console.log(outQue, operatorStack);
    const RPN = outQue.items.join(' ');
    const rpnArr = outQue.items.map(item => item);
    console.log('RPN', RPN, rpnArr);

    //Read all the tokens from left to right till you get to an Operator or Function. Knowing that the Operator/Function
    //takes n arguments (for instance, for +, n = 2; for cos(), n = 1), evaluate the last n preceding arguments with the
    //Operator/Function, and replace all of them (Operator/Function + operands) with the result. Continue as before, until
    //there are no more Operators/Functions left to read. The only (Literal or Variable) token left is your answer.
    let holdArr = [];
    while (rpnArr.length) {
        const item = rpnArr.shift();
        if (item.match(opRegEx) || item.match(funcRegEx)) {
            if (item.match(opRegEx) && holdArr.length >= 2) {
                const num1 = holdArr.pop();
                const num2 = holdArr.pop();
                rpnArr.unshift(eval(num2 + item + num1));
            } else if (item.match(funcRegEx) && holdArr.length >= 1) {
                const num = holdArr.pop();
                rpnArr.unshift();
            }
        } else if (item.match(numRegEx)) {
            holdArr.push(item);
        }
    }
    //(This is a simplified algorithm, which assumes the expression is valid. A couple indicators that the expression isn’t
    //valid are if you have more than one token left at the end, or if the last token left is an Operator/Function.)
};
