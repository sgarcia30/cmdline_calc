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
    const tokenPattern = /(\d+(\.\d*)?|\.\d+)|([+\-*/%^×÷])|(\b(sin|cos|tan|sqrt|log|ln|asin|acos|atan|abs|round|floor|ceil|max|min)\b)|([\(\)])|(\s+)/g
    // const tokenPattern = /(?:\d+(?:\.\d+)?|\+|\-|\×|\÷|\*|\/|\^|\(|\))/g;
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
    console.log(tokens);
    // while there are tokens to be read:
    while (tokens && tokens.length) {
        // read a token
        const elem = tokens.shift();
        console.log(elem);
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
            while (operatorStack.peek() && (assoc[elem] === 'left' && prec[elem] <= prec[operatorStack.peek()]) || (assoc[elem] === 'right' && prec[elem] < prec[operatorStack.peek()])) {
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

    const rpnArr = outQue.items.map(item => item);
    console.log(rpnArr);

    //Read all the tokens from left to right till you get to an Operator or Function. Knowing that the Operator/Function
    //takes n arguments (for instance, for +, n = 2; for cos(), n = 1), evaluate the last n preceding arguments with the
    //Operator/Function, and replace all of them (Operator/Function + operands) with the result. Continue as before, until
    //there are no more Operators/Functions left to read. The only (Literal or Variable) token left is your answer.
    let holdArr = [];
    while (rpnArr.length) {
        const item = rpnArr.shift();
        if (item && (typeof item === 'number' || item.match(numRegEx))) {
            holdArr.push(parseFloat(item));
        } else {
            if (item && item.match(opRegEx) && holdArr.length >= 2) {
                const num2 = holdArr.pop();
                const num1 = holdArr.pop();
                if (item === '+')  holdArr.push(num1 + num2);
                else if (item === '-')  holdArr.push(num1 - num2);
                else if (item === '/' || item === '÷')  holdArr.push(num1 / num2);
                else if (item === '*' || item === '×')  holdArr.push(num1 * num2);
                else if (item === '^')  holdArr.push(Math.pow(num1, num2));
            } else if (item && item.match(funcRegEx) && holdArr.length >= 1) {
                console.log('sub else');
                const num = holdArr.pop();
                if (item === 'sin') holdArr.push(Math.sin(num))
                else if (item === 'cos') holdArr.push(Math.cos(num))
                else if (item === 'tan') holdArr.push(Math.tan(num))
                else if (item === 'asin') holdArr.push(Math.asin(num))
                else if (item === 'acos') holdArr.push(Math.acos(num))
                else if (item === 'atan') holdArr.push(Math.atan(num))
                else if (item === 'abs') holdArr.push(Math.abs(num))
                else if (item === 'max') holdArr.push(Math.max(num))
                else if (item === 'min') holdArr.push(Math.min(num))
                else if (item === 'log') holdArr.push(Math.log(num))
                else if (item === 'sqrt') holdArr.push(Math.sqrt(num))
                else if (item === 'floor') holdArr.push(Math.floor(num))
                else if (item === 'ceil') holdArr.push(Math.ceil(num))
                else if (item === 'round') holdArr.push(Math.round(num))
            }
        }
    }
    console.log(holdArr, rpnArr);
    if (holdArr.length === 1) {
        console.log(holdArr[0].toString());
        return holdArr[0];
    }
    //(This is a simplified algorithm, which assumes the expression is valid. A couple indicators that the expression isn’t
    //valid are if you have more than one token left at the end, or if the last token left is an Operator/Function.)
};
