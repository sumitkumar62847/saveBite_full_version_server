import jwt from 'jsonwebtoken';

export const LoginUser = async (req, res) => {
    try{
        const token = req.headers.authorization?.split('Bearer ')[1];
        if(token){
            jwt.verify(token,'nahipata', (err, user) =>{
                if(err){
                    res.status(404).json({message: 'Unauthorized'})
                }
                res.status(200).json({message: 'you are successfully login'});
            })
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}