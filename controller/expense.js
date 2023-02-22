const Expense = require('../models/expense');
// const { BlobServiceClient } = require('@azure/storage-blob');
// const { v1: uuidv1} = require('uuid');
const User = require('../models/user');
const DownloadedFile=require('../models/downloadedFile')
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3service = require('../services/S3services')

const downloadExpense = async(req, res) => {
    try{
      const expenses = await UserServices.getExpenses(req);
      console.log(expenses);
      const stringifiedExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `Expense${userId}/${new Date()}.txt`;
      const fileUrl = await S3service.uploadToS3(stringifiedExpenses, filename);
      console.log(fileUrl);

      DownloadedFile.create({
        url:fileUrl,
        userId:req.user.id
    })
      res.status(200).json({ fileUrl, success: true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'', success:false, err: err})
    }
}

const addExpense = async(req, res, next) => {
        const t=await sequelize.transaction();
        try{
            const { amount, description, category } = req.body;

        if(amount == undefined || amount.length === 0){
            return res.status(400).json({success: false, message: 'Parameters missing'})
        }

      const expense =  Expense.create({amount, description, category, userId: req.user.id},{transaction: t})
            const totalExpense = Number(req.user.totalExpenses)+ Number(amount)
            await User.update({
                totalExpenses: totalExpense
            },{
                where : {id: req.user.id},
                transaction: t
            })
                await t.commit();
                res.status(200).json({expense:expense})
        }catch(err){
                await t.rollback();
                return res.status(500).json({success:false, error:err})
        }
    }

const getExpense = (req, res) => {
req.user.getExpenses().then(expenses=> {
        return res.status(200).json({expenses:expenses, success:true})
    }).catch(err => {
        console.log(err)
            return res.status(500).json({error: err, success: false})
        }) 
    }

const deleteExpense = async(req, res, next) => {
    try{
        const expenseid = req.params.expenseid;
        if(expenseid == undefined  || expenseid.length === 0){
           return res.status(400).json({success: false, message:"Parameters missing"})
        }
        const noofrows = await Expense.destroy({where: {id:expenseid}})
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense does not belong to the user'})
        }
        return res.status(200).json({success: true, message:"Deleted Successfully"})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: true, message:"Failed"})
    }
}

// const downloadExpense =  async (req, res) => {

//     try {
//         if(!req.user.ispremiumuser){
//             return res.status(401).json({ success: false, message: 'User is not a premium User'})
//         }
//         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
//         // Create the BlobServiceClient object which will be used to create a container client
//         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

//         // V.V.V.Imp - Guys Create a unique name for the container
//         // Name them your "mailidexpensetracker" as there are other people also using the same storage

//         const containerName = 'dominic09expensetracker'; //this needs to be unique name

//         console.log('\nCreating container...');
//         console.log('\t', containerName);

//         // Get a reference to a container
//         const containerClient = await blobServiceClient.getContainerClient(containerName);

//         //check whether the container already exists or not
//         if(!containerClient.exists()){
//             // Create the container if the container doesnt exist
//             const createContainerResponse = await containerClient.create({ access: 'container'});
//             console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
//         }
//         // Create a unique name for the blob
//         const blobName = 'expenses' + uuidv1() + '.txt';

//         // Get a block blob client
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         console.log('\nUploading to Azure storage as blob:\n\t', blobName);

//         // Upload data to the blob as a string
//         const data =  JSON.stringify(await req.user.getExpenses());

//         const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//         console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

//         //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
//         const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
//         res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
//     } catch(err) {
//         res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
//     }

// };

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpense
}