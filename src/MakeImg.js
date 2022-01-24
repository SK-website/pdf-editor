import { usePdf } from "@mikecousins/react-pdf";
import React, { useEffect, useRef, useState} from "react";



  const MakeImg = (props) => {
    const page = props.number;
    const updateFin = props.updateFin;
    const isMounted = useRef(true);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const coordRef = useRef({x: 0, y: 0});
    // const [isDrawing, setIsDrawing] = useState(false);
  
    const { pdfDocument, pdfPage } = usePdf({
    file: "https://basecamp-dynamics-core-api.azurewebsites.net/workshop//api/sharepoint-documents/file/60af3890-392d-40fc-8179-542e942acd20",
    page,
    canvasRef,
  });

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 744;
        canvas.height = 1052;
        const ctx = canvas.getContext('2d'); 
        contextRef.current = ctx;
        console.log(canvas);
        console.log('I work', page, '---page', canvasRef.current, '---canvasRef.current')
    }, []);

    // useEffect(() => {
    //   if(isMounted.current && props.save){
    //     console.log(props.save, 'props.save');
    //     const img = canvasRef.current.toDataURL();
    //     updateFin(page, img);
    //   }
    //   return () => {
    //     isMounted.current = false;
    //    }
    // }, [props.save]);

    const startDrawing= ({nativeEvent}) => {     
      const {offsetX, offsetY} = nativeEvent;
      coordRef.current = {x: offsetX, y: offsetY};
      console.log('drow, coord', offsetX, offsetY)
        // setIsDrawing(true)
      contextRef.current.strokeStyle = "red";
      }

      const finishDrawing = ({ nativeEvent }) => {
      const {offsetX, offsetY} = nativeEvent;
      //  if(!isDrawing) return; 
       contextRef.current.strokeRect(coordRef.current.x, coordRef.current.y, 
        offsetX-coordRef.current.x, offsetY- coordRef.current.y);    
        console.log( coordRef.current)
       contextRef.current.closePath();
      //  setIsDrawing(false);
     }

  return (     
    <canvas ref={canvasRef} width='744' height='1052'
      onMouseDown={startDrawing} 
      onMouseUp={finishDrawing}></canvas> 
    )
}

export default MakeImg;
