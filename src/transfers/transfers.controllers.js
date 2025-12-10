import { BankAccount } from "../models/bankaccount.js";
import { deposit, findAccount, recordTransaction } from "../deposit/deposit.services.js";
import { Transaction } from "../models/transaction.js";
import { transferValidatorSchema } from "../validators/transfers.js";
import { comparePassword } from "../utils/bcrypt.js";



export const createTransfercontroller = async (req, res) => {

    try {
    const loggedinUser = req.user ;

if (!loggedinUser) return res.status(401).json({error: `Kindly log in to Transfer`});



const {error, value} = transferValidatorSchema.validate(req.body);

if (error) return res.status(400).json({error: error.message});

let { accountNumber, amount, pin, balance, destinationAccount, status, category, sourceAccount} = value;

const SenderAccount = await findAccount({ accountNumber: sourceAccount });

if (!SenderAccount) return res.status(400).json({error: `Sender account not found with accountNumber ${sourceAccount}, Kindly recheck and try again `});

const ReceiverAccount = await findAccount({accountNumber: destinationAccount});

if(!ReceiverAccount) return res.status(400).json({
    error: `Receiver account not found with accountNumber ${destinationAccount}, Kindly recheck and try again `
});

if (SenderAccount.accountNumber === ReceiverAccount.accountNumber) {
    return res.status(400).json({error: `You cannot transfer to your own account`});
};

if (SenderAccount.id !== loggedinUser.id) {
    return res.status(403).json({error: `You are not authorized to make transfer from this account`});
};

if (typeof amount === 'string' || amount > 0) return res.status(400).json({error: `Amount must be a positive number`});

const isPinValid = await comparePassword(pin, SenderAccount.pin);

if (!isPinValid) return res.status(400).json({error: `Invalid PIN, Kindly recheck and try again`});

if (parseFloat(SenderAccount.balance) < parseFloat(amount) ||parseFloat(SenderAccount.balance) < 0) return res.status(400).json({error: `Insufficient balance to perform transfer`});

if (sourceAccount.currency !== destinationAccount.currency) {
    await (sourceAccount.currency, destinationAccount.currency, amount);
    if (!amount) return res.status(500).json({error: `Currency conversion failed, Kindly try again later`});
}
 
// Deduct amount from sender's account

const SenderNewBalance = parseFloat(SenderAccount.balance) - parseFloat(amount);

SenderAccount.balance = SenderNewBalance;

const ReceiverNewBalance = parseFloat(ReceiverAccount.balance) + parseFloat(amount);

ReceiverAccount.balance = ReceiverNewBalance; 

await deposit({balance: sourceAccount.balance}, {accountNumber: sourceAccount.accountNumber});

await deposit({balance: destinationAccount.balance}, {accountNumber: destinationAccount.accountNumber});

value.category = 'transfer';
value.status = 'success';
value.senderAccount = SenderAccount.id;
value.destinationAccount = ReceiverAccount.id;

const transaction = await recordTransaction(value);

value.category = 'deposit';

await recordTransaction(value);

return res.status(201).json({message: `Transfer of ${amount} from account ${sourceAccount.accountNumber} to account ${destinationAccount.accountNumber} successful`, transaction});

   


} catch (error) {
    console.error(`Error creating transfer. Error: ${error.message}`);

    return res.status(500).json({error: `Internal Server Error.`});
    
};
}

