import React, { useRef ,useCallback ,useState} from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";
import { Log } from "@tensorflow/tfjs";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //for dev time
  const [imgSrc, setImgSrc] = useState(null);
  const [stop,setStop] = useState(false);
  const [delay,setDealy] =useState(0)
  const [accuracy,setAccuracy]=useState('')
  var setArchitecture,setOutputStride,setMultiplier,setQuantBytes;

    const handleChanges=(e)=>{
      setAccuracy(e.target.value);
      switch (accuracy) {
        case 'low':
          return(
            setArchitecture = "MobileNetV1",
            setOutputStride="8",
            setMultiplier='0.50',
            setQuantBytes='1'
          )
        case 'middle':
          return(

            setArchitecture = "MobileNetV1",
            setOutputStride="16",
            setMultiplier='0.75',
            setQuantBytes='2'
          )
        case 'high':
          return(
            setArchitecture = "ResNet50",
            setOutputStride="32",
            setMultiplier='1.0',
            setQuantBytes='4'
            )
      
        default:
          break;
      }
    }

  //state of bodyparts
  const [shouler,setShouler] = useState();
  const [waist,setWaist] = useState();

  const capture = useCallback(() => {
    setTimeout(()=>{
      runBodysegment();
      setImgSrc( webcamRef.current.getScreenshot());
    },delay*1000 )
  }, [webcamRef, setImgSrc]);
  
  const runBodysegment = (async() => {

    const net = await bodyPix.load({
      architecture: setArchitecture,             // MobileNetV1,ResNet50
      outputStride: setOutputStride,             // ( 8, 16, 32)
      multiplier:setMultiplier,                  // (1.0, 0.75, or 0.50)
      quantBytes: setQuantBytes                  // (4,2,1) 
    });

    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        
        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        
        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        
        // Make Detections
        const person = await net.segmentPersonParts(video);
        console.log(person);

        findMearsurments(shouler ,person);
        findMearsurments(waist ,person);
        

        //list of body part score above 0.7
        // if(person.allPoses.length !== 0)
        // person.allPoses[0].keypoints.forEach(element=>  {if(element.score > 0.7)console.log(element.part)});
     
        const coloredPartImage = bodyPix.toColoredPartMask(person);
        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0.2;
        const canvas = canvasRef.current;
        
        bodyPix.drawMask(
          canvas,
          video,
          coloredPartImage,
          opacity,
          maskBlurAmount,
          flipHorizontal,
          );

          setImgSrc(webcamRef.current.getScreenshot());
         
        }
    
  });

  //Distance between two point
  const distanceBetweenPoint =(x1,y1,x2,y2)=>{
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2))
  }

  //Find the measurements of body parts 
  const findMearsurments = async ( bodyParts , person)=>{
      var x1,x2,y1,y2;
        // var ctx = canvasRef.current.getContext("2d");
      
        switch (bodyParts) {
          case shouler:
              person.allPoses[0].keypoints.forEach(element=>{
                if (element.part == 'leftShoulder' && element.score > 0.7){
                  x1 =element.position.x;
                  y1 =element.position.y;
                  console.log(x1,y1);
                }
                if (element.part == 'rightShoulder' && element.score > 0.7){
                  x2 =element.position.x;
                  y2 =element.position.y;
                  console.log(x2,y2);
                }
                setShouler(distanceBetweenPoint(x1,y1,x2,y2) );
              });
              break;

            // case cheast:
            //   break;

            case waist:
              person.allPoses[0].keypoints.forEach(element=>{

                if (element.part == 'leftWrist' && element.score > 0.7){
                  x1 =element.position.x;
                  y1 =element.position.y;
                  console.log(x1,y1);
                }
                if (element.part == 'rightWrist' && element.score > 0.7){
                  x2 =element.position.x;
                  y2 =element.position.y;
                  console.log(x2,y2);
                }
                setWaist(distanceBetweenPoint(x1,y1,x2,y2));
              });
              break;
              
            // case hip:
            //   break;
            // case innerLeg:
            //   break;
            // case outerLeg:
            //   break;
            // case sleev:
            //   break;
              default:
                break;
              }
              
          
          
        // ctx.beginPath();
        // ctx.moveTo(x1, y1);
        // ctx.lineTo(x2, y2);
        // ctx.lineWidth = 10;
        // ctx.strokeStyle = "#abcd120" ;
        // ctx.stroke();

        //  console.log(Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2)));
  }

  return (
    <div className="App">
      <header className="App-header">
        {stop &&
            <>
            <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            />
             <button onClick={capture}>Capture photo</button>
            </>
        }

        {imgSrc && (
          <>
            <br/>
            <img src={imgSrc} />
            <h4 >Body Segment :</h4>
            <canvas ref={canvasRef} />
          </>
          )}
       
        <div className ="row" style={{width:"40%"}}><br/>
          <label>Time Delay :  </label>
          <input placeholder='Enter number for time Delay to capture the photo (Optional) :'  type='Number' min='0' max='20' style={{width:"60%"}} onChange={(e)=>{setDealy(e.target.value)}}/>
        </div>
        <div className ="row" style={{width:"40%"}}><br/>
          <label >Accuracy : </label> 
          <select placeholder="accuracy"  defaultValue="middle" onChange={handleChanges} >
            <option value="low">Low</option>
            <option value="middle">Middle</option>
            <option value="high">High</option>
          </select>
        </div><br/>
        
        <button onClick={()=>{setStop(!stop);}}>{stop ? "Stop" :"Start"}</button>
        
        {stop &&
          <>
            <span>Shouler : { typeof shouler == 'undefined' || 'NaN' ? " I can't find your shouler .Please try again with different angle " : shouler }</span>
            <span>Waist : { typeof waist == 'undefined' || "NaN" ? " I can't find your waist .Please try again with different angle " :   waist}</span>
          </>
        }
      </header>
    </div>
  );
}

export default App;


