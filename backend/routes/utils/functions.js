const pool = require("../../config/db"); // Adjust the path to your db.js file

async function verifyBusiness(userId, businessId){

    const [rows] = await pool.execute(
      `SELECT count(id) as rows FROM businesses WHERE id = ${businessId} AND user_clerk_id = '${userId}'`
    );
  
    if(rows[0].rows > 0){
        return true;
    }else{
        return false;
    }
  
}

module.exports = {
    verifyBusiness
}

