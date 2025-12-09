import { createAccountScherma } from "../validators/accounts.js";
import { createAccount, getAccounts } from "./accounts.services.js";
import {generateUniqueNumber} from "../utils/accountNumber.js";
import { BankAccount } from "../models/bankaccount.js";


export const createAccountController = async (req, res) => {
    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to access this endpoint`});

        const {error, value} = createAccountScherma.validate(req.body);

        if(error) return res.status(400).json({error: error.message});

        let {accountType, currency, userID, accountNumber, pin} = value;

        if (!["USD", "NGN"].includes(currency)) {
            return res.status(400).json({error: `Invalid currency. Supported currencies are USD and NGN.`});
        }

        value.accountNumber = await generateUniqueNumber(10, BankAccount);

        value.userID = loggedInUser.id;
        value.email = loggedInUser.email;

        const account = await createAccount(value);

        return res.status(201).json({account});
        
    } catch (error) {

        console.error(`Error creating bank account. Error: ${error}`);

        return res.status(500).json({error: `Internal Server Error`});
        
    }
};

export const viewAccountsController = async (req, res) => {
    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to access this endpoint`});

        const accounts = await getAccounts({userID: loggedInUser.id});

        if(!accounts) return res.status(404).json({error: `There are currently no accounts to display`});

        return res.status(200).json({accounts});
        
    } catch (error) {

        console.error(`Error viewing accounts. Error: ${error}`);

        return res.status(500).json({error: `Internal Server Error.`});
        
    }
};


export const accountPincontroller = async (req, res) => {
    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(400).json({error:`Unathorized` });

        let {pin, accountNuber} = req.body;

        if (!pin || pin < 4 ) return res.status(404).json({error: `Enter a valid pin`});

        if (!accountName) return res.status(404).json({error: `Account number is required`});

        const accountExist = await findAccount({accountNuber});

        if(!accountExist) return res.status(404).json({error: `Account not found`});

        if (accountExist.userID !== loggedInUser.id) return res.status(403).json({error: `Access denied`});

        pin = await hashPassword(pin);

        await deposit({pin}, {accountNumber});

        return res.status(200).json({message: `Pin updated Successfully`});


        
    } catch (error) {
        
         console.error(`Error updating pin. Error: ${error}`);

        return res.status(500).json({error: `Internal Server Error.`});
    }
}