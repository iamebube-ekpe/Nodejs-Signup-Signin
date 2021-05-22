const express = require('express');
const router = express.Router();

// Importing the mongodb user models
const Users = require('./../models/users');

// Password cryptographic handler
const bcrypt = require('bcrypt');
const User = require('./../models/users');

// For signing up
router.post('/signup', (req, res)=> {
    let{name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password= password.trim();
    dateOfBirth = dateOfBirth.trim();

    if ( name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });

    } else if ( !/^[a-zA-Z ]*$/.test(name) ) {
        res.json({
             status: "FAILED",
            message: "Invalid name entered"
        });
       
    } else if ( !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });

    } else if ( !new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        });

    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Your password is too short."
        });

    } else(
        // Check if the user already exists in the database
        User.find(email).then(result =>{
            if(result.length){
                // Then that means a user already exists
                res.json({
                    status: "FAILED",
                    message: "User with this email exists already!"
                })
            } else{
                // Save the new user to the database

                // Password encryption
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword=> {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });
                    
                    // Saving the user
                    newUser.save().then(result =>{ 
                        res.json({
                            status: "SUCCESS",
                            message: "SignUp successful",
                            date: result,
                        })
                    }).catch(err =>{
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving user"
                        });
                    });

                }).catch(err =>{
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while trying to encrypt the password"
                    });
                });
            }
        }).catch(err =>{
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while checking for an existing user!!'
            });
        })
    );

});


// For login
router.post('/login', (req, res)=> {

});

module.exports = router;