import {Mongo} from 'meteor/mongo';
import { check,Match } from 'meteor/check';
 Meteor.methods({
        'tokens.insert' : function(token) {
            check(token,String);
            console.log("the token in method is",token);
        const userId = this.userId;
        if(Tokens.find({ customerId : userId }).count()){
            console.log("user found")
            Tokens.update({ customerId : userId},{token : token});
        }if(Tokens.find({ customerId : userId }).count() == 0){
            Tokens.insert({ customerId : userId,token : token});
        }
    }
});
export const Tokens = new Mongo.Collection('tokens'); 