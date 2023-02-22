var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const mongoose = require("mongoose");

var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blog");
mongoose.set("strictQuery", false);

const blogSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

var schema = buildSchema(`

type name {

  fullname : String
  age : Int


}



  type Query {

    details : [name]
  
  }

  input PostValue {

    fullName : String 
    age : Int

  }

  type Mutation {

    postMessage(Post : PostValue) : name

  }



`);

var root = {
  details: () => {
    return Blog.find({});
  },

  postMessage: async (arg) => {
    const { fullName, age } = arg.Post;

    // let value = await new Blog({
    //   fullname: fullName,
    //   age,
    // });

    // let newValue = await value.save();

    let value = await Blog.create({ fullname: fullName, age: age });

    console.log(value);

    return value;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);

// http://localhost:4000/graphql

// # mutation{
//   #   postMessage(Post : {
//   #     fullName : "amily"
//   #       age : 23

//   #     }
//   #     ) {
//   #     fullname
//   #     age
//   #   }

//   # }

//   # query {
//   #   details {

//   #     fullname,
//   #     age

//   #   }
//   # }
