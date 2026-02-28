const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const findMissingMarkers = (startCode = []) => {
  const missing = [];
  for (const entry of startCode || []) {
    const code = entry?.initialCode || "";
    const hasMarkers =
      code.includes("VISIBLE_CODE_START") && code.includes("VISIBLE_CODE_END");
    if (!hasMarkers) {
      missing.push(entry?.language || "unknown");
    }
  }
  return missing;
};

const createProblem = async (req,res)=>{
   
  // API request to authenticate user:
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
      
      const missingMarkers = findMissingMarkers(startCode);
      if (missingMarkers.length) {
        return res.status(400).json({
          message: `Starter code must include VISIBLE_CODE_START and VISIBLE_CODE_END markers for: ${missingMarkers.join(", ")}`
        });
      }

      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);


       console.log(testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const normalizedTags = normalizeTags(tags);

    const userProblem =  await Problem.create({
        ...req.body,
        tags: normalizedTags,
        problemCreator: req.result._id
      });

      res.status(201).json({
        message: "Problem Saved Successfully",
        problemId: userProblem._id
      });
    }
    catch(err){
        console.log(err);
        res.status(400).send("Error: "+err);
    }
}

const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
    const {title,description,difficulty,tags,
      visibleTestCases,hiddenTestCases,startCode,
      referenceSolution, problemCreator
     } = req.body;

  try{

     if(!id){
      return res.status(400).send("Missing ID Field");
     }

    const missingMarkers = findMissingMarkers(startCode);
    if (missingMarkers.length) {
      return res.status(400).json({
        message: `Starter code must include VISIBLE_CODE_START and VISIBLE_CODE_END markers for: ${missingMarkers.join(", ")}`
      });
    }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language,completeCode} of referenceSolution){
         

      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);
        
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      console.log(`Submit Result: ${submitResult}`);

      const resultToken = submitResult.map((value)=> value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      
     const testResult = await submitToken(resultToken);

     console.log(testResult);

    console.log(`Test Result: ${testResult}`);

     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const normalizedTags = normalizeTags(tags);

  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body, tags: normalizedTags}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}


const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution constraints inputFormat outputFormat ');
   
    // video ka jo bhi url wagera le aao

   if(!getProblem)
    return res.status(404).send("Problem is Missing");

   const videos = await SolutionVideo.findOne({problemId:id}).sort({createdAt:-1});

   if(videos){   
    
   const responseData = {
    ...getProblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
    videoSourceType: videos.sourceType,
    youtubeUrl: videos.youtubeUrl,
   } 
  
   return res.status(200).send(responseData);
   }
    
   res.status(200).send(getProblem);

  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}


const solvedAllProblembyUser =  async(req,res)=>{
   
    try{
       
      const userId = req.result._id;

      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
      
      res.status(200).send(user.problemSolved);

    }
    catch(err){
      res.status(500).send("Server Error");
    }
}

const submittedProblem = async(req,res)=>{
  try{
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({userId, problemId});
    
    if(ans.length === 0) {
      return res.status(200).send("No Submission is present");  // ✅ add return
    }

    return res.status(200).send(ans);  // ✅ also use return here for clarity
  }
  catch(err){
    return res.status(500).send("Internal Server Error");
  }
}

const testProblemCode = async (req, res) => {
  try{
    const {language, code, visibleTestCases, hiddenTestCases} = req.body;

    const languageId = getLanguageById(language);

    const allTestCases = Object.asssign({},visibleTestCases,hiddenTestCases);

    const submissions = allTestCases.map((testcase)=>({
          source_code: code,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


    const submitResult = await submitBatch(submissions);
    console.log(`Submit Result: ${submitResult}`);

    const resultToken = submitResult.map((value)=> value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;
    let failedTestcases = [];

    for (const test of testResult) {
      if (test.status_id==3) {
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
            failedTestcases.push(test.stdin)
          }
          else{
            status = false
            errorMessage = test.stderr
            failedTestcases.push(test.stdin)
          }
        }
      }
    }

    res.status(201).json({
      success: status, 
      testcases: testResult,
      runtime: runtime,
      memory: memory,
      errorMessage: errorMessage,
      failedTestcases: failedTestcases
    })


  } catch(err){
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem, testProblemCode};


