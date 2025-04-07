   
   import axios from "axios";
   
   const API_KEY="wxjo53bx044ygpwpr";
   const BASE_URL="https://techhk.aoscdn.com/api/tasks/visual/scale/";
   const MAXIMUM_RETRIES = 15;

    export const enhancedImageApi=async(file)=>{
  //code to call api and get enhanced image url


  try{
      const taskId = await uploadImage(file);
      console.log("Image Uploaded successfully, Task ID:", taskId);


      const enhancedImageData =await PollForEnhancedImage(taskId);
      console.log("Enhanced Image Data:",enhancedImageData);

     
     return enhancedImageData;

    } catch (error){
    console.log("Error enhancing image:", error.message);
  }
}; 



const uploadImage=async(file)=>{
   const formData=new FormData();
   formData.append("image_file",file);


  const {data}= await axios.post('${BASE_URL}/api/tasks/tasks/visual/scale',formData,{
    Headers:{
      "Content-Type":"multipart/form-data",
      "X-API-KEY":API_KEY,
    },
   });

// code to upload image
    // "/api/tasks/tasks/visual/scale"---GET
   if (!data?.data?.task_id){
    throw new Error("Failed to upload image! task ID not found.");
   }
    return data.data.task_id;
};
 
    // /api/tasks/visual/scale/{task_id}---POST



const PollForEnhancedImage = async(taskId,retries=0)=>{
  const result = await fetchEnhancedImage(taskId);
   
  if(result.state===4){
    console.log('Processing...(${retries}/${MAXIMUM_RETRIES})');

    if(retries>=MAXIMUM_RETRIES){
      throw new Error ("Max retries reached.Please try again later.");
    }
    //wait for 2 sec.
    await new Promise((resolve)=> setTimeout(resolve,2000));

    return  PollForEnhancedImage(taskId,retries+1);
  }
  console.log("Enhanced Image URL:",result);
  return result;
};



  const fetchEnhancedImage = async(taskId)=>{
    const { data } = await axios.get(
      `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
      {
          headers: {
              "X-API-KEY": API_KEY,
          },
      }
  );
  if (!data?.data) {
      throw new Error("Failed to fetch enhanced image! Image not found.");
  }

  return data.data;
};
  

