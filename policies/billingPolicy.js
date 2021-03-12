module.exports=(carModel)=>{
    var today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    var repairCost= 200000;
    if(parseInt(carModel)<=1997){
        repairCost+=repairCost*0.2;
    }
    if(parseInt(day)%2==0){
        repairCost+=repairCost*0.05
    }
    return repairCost;
}