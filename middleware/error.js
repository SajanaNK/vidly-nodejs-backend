

function error(error,req,res,next){
    console.log(error);
    res.status(500).send('Something went wrong : ' + error);
}

export { error };
