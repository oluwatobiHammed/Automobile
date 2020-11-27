import { BodyStyles } from "./BodyStyles"
import { Make } from "./Make"
import { SellingCondition } from "./SellingCondition"
import { Transmission } from "./Transmission"


  const vehicleConditionValid = (val?: string) => {
   if (SellingCondition.brandNew === val) {
     return true
   }else if (SellingCondition.foreignUsed === val) {
    return true
   }

   else if (SellingCondition.locallyUsed === val) {
    return true
   }
     
    return false
}

const vehicleBodyStyleValid = (val?: string) => {
  if (BodyStyles.Bus === val) {
    return true
  }else if (BodyStyles.Convertible === val) {
   return true
  }

  else if (BodyStyles.Coupe === val) {
   return true
  }
  else if (BodyStyles.Crossover === val) {
    return true
   }
   else if (BodyStyles.Minivan === val) {
    return true
   }
   else if (BodyStyles.Other === val) {
    return true
   }
   else if (BodyStyles.Pickup === val) {
    return true
   }
   else if (BodyStyles.Sedan === val) {
    return true
   }
   else if (BodyStyles.StationWagon === val) {
    return true
   }
   else if (BodyStyles.hatchback === val) {
    return true
   }
   return false
}


const makeValid = (val?: string) => {
  if (Make.toyota === val) {
    return true
  }else if (Make.volkswagen === val) {
   return true
  }

  else if (Make.volvo === val) {
   return true
  }
  else if (Make.nissan === val) {
    return true
   }
   else if (Make.lexus === val) {
    return true
   }
   else if (Make.kia === val) {
    return true
   }
   else if (Make.ivm === val) {
    return true
   }
   else if (Make.hyundai === val) {
    return true
   }
   else if (Make.honda === val) {
    return true
   }
   else if (Make.ford === val) {
    return true
   }
   else if (Make.chrysler === val) {
    return true
   }
   else if (Make.casalini === val) {
    return true
   }
   else if (Make.buick === val) {
    return true
   }
   else if (Make.bmw === val) {
    return true
   }
   else if (Make.acura === val) {
    return true
   }
   return false
}
const vehicleTransmissionValid = (val?: string) => {
  if (Transmission.Automatic === val) {
    return true
  }else if (Transmission.Manual === val) {
   return true
  }
    
   return false
}

 export {vehicleConditionValid,vehicleBodyStyleValid, vehicleTransmissionValid, makeValid}