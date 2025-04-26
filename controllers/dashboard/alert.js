import { Alert } from "../../models/dashboard/alert.js"

export const getAllAlerts = async(req,res)=>{
    try {
        const alerts = await Alert.find({})
        if(!alerts){
            return res.status(404).json({success:false,message:'No alert found.'})
        }
        return res.status(200).json({success:true,data:alerts})    
    } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message, data: [] });
    }
    
}

export const findSingleAlert = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({success:false,message:"Please provide alert id"})
        }
        const alert = await Alert.findById(id);
        return res.status(200).json({success:true,data:alert});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

export const findFilteredAlerts = async(req,res)=>{
    try {
        const { alertType, userId,patientId,diseaseId } = req.body;
        let filterObject = {};
        if (alertType) {
          filterObject["alertType"] = alertType;
        }
        if (userId) {
          filterObject["userId"] = userId;
        }
        if (patientId) {
          filterObject["patientId"] = patientId;
        }
        if (diseaseId) {
            filterObject["diseaseId"] = diseaseId;
          }
        const alerts = await Alert.find(filterObject);
        if(!alerts){
            return res.status(404).json({success:false,message:"No alert found."})
        }
        return res
          .status(200)
          .json({ success: true, data: alerts });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message, data: [] });
      }
}

export const createAlert = async(req,res)=>{
    try {
        const alertType = req.params.type;
        let patientId = null,diseaseId=null
        if(alertType ==="Patient"){
            patientId = req.params.id;
        }else{
            diseaseId = req.params.id ;
        }
        const {userId,alertMessage,isActive} = req.body;
        if(!alertType || !userId || !alertMessage){
            return res.status(400).json({success:false,message:"Provide all required entries to create an alert."})
        }
        await Alert.create({
            alertType,userId,patientId,diseaseId,alertMessage,isActive
        })
        return res.status(201).json({success:true,message:"Alert created successfully."})    
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
    
}


export const deleteAlert = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({success:false,message:"Please provide alert id to delete"})
        }
        await Alert.findByIdAndDelete(id)
        return res.status(200).json({success:true,message:"Alert deleted successfully."})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}


export const toggleAlert = async(req,res)=>{
    try {
    const id = req.params.id        
    if(!id){
        return res.status(404).json({success:false,message:"Please provide alert id to toggle"})
    }
    const alert = await Alert.findById(id);
    if(!alert){
        return res.status(404).json({success:false,message:"No notification with this id found."})
    }
    alert.isActive = !alert.isActive
    alert.save()
    return res.status(200).json({success:true,message:`${alert.isActive?"Alert is active.":"Alert is not active now."}`})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}