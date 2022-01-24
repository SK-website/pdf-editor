
import React, { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import './style.css';
import MakeImg from './MakeImg';

const Canvas = () => {
    // let canvas = window.document.getElementsByTagName('canvas')[0];

    const [page, setPage] = useState(null);
    const [coord, setCoord] = useState({x: 0, y: 0});
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [fin, setFin] = useState([]);
    const pointsRef = useRef([]);
    const [save, setSave] = useState(false);
    const listOfPages = [];
    const url = "https://basecamp-dynamics-core-api.azurewebsites.net/workshop//api/sharepoint-documents/file/60af3890-392d-40fc-8179-542e942acd20";

    const { pdfDocument, pdfPage } = usePdf({
      file: "https://basecamp-dynamics-core-api.azurewebsites.net/workshop//api/sharepoint-documents/file/60af3890-392d-40fc-8179-542e942acd20",
      page,
      canvasRef,
    });

    useEffect(() => {
      if (pdfDocument)
      {
        listOfPages.length=pdfDocument.numPages;
        const canvas = canvasRef.current;  
        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;
        console.log(listOfPages)        
         console.log("I work 3", canvas.style.width, canvas.style.height)
     }   
    }, [pdfDocument]);

    useEffect(() => {
      if (pdfDocument && pdfDocument.numPages) {
      if (fin.length === pdfDocument.numPages)
        {
          setSave(false);       
        }   
      }
    }, [fin]);

const updateFin = (pageNum, img) => {
  setFin(prev => {
    if(!fin.length) setFin(prev => [...prev, {[pageNum]: img}]);    
    console.log( {[pageNum]: img})
    return prev.map((el, i) => ((i+1) === pageNum) ? {[pageNum]: img} : {[pageNum]: el} );
  })
}
// }

  const saveLastRect = (startX, startY, width, height) => {
  pointsRef.current.push({x: startX, y: startY, width, height})  
  }
  const undo = () => {  
  const rectPosition = pointsRef.current.pop();
  console.log(rectPosition, 'rectPosition');
  contextRef.current.clearStrokeRect(rectPosition.x, rectPosition.y, rectPosition.width, rectPosition.height);
  }

  const startDrawing= ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
      setCoord({x: offsetX, y: offsetY})
      console.log('drow, coord', offsetX, offsetY)
          // contextRef.current.beginPath(); 
          // contextRef.current.moveTo(offsetX, offsetY)
          setIsDrawing(true)
          contextRef.current.strokeRect(coord.x, coord.y, (offsetX-coord.x), (offsetY-coord.y));
          contextRef.current.strokeStyle = "red";
          // ctx.stroke();
          // ctx.save();
  };
  
  const finishDrawing = ({ nativeEvent }) => {
     {console.log(pdfPage)}
    const {offsetX, offsetY} = nativeEvent;
    if(!isDrawing) return; 
    contextRef.current.strokeRect(coord.x, coord.y, (offsetX-coord.x), (offsetY-coord.y));    
    contextRef.current.closePath();
    setIsDrawing(false);
    const img = canvasRef.current.toDataURL();
    const p = page - 1;
    console.log(p, 'p', page)
    setFin(prev => {
      if(prev.length - 1 < p) return [...prev, img];
      return prev.map((el, i) => (i === p) ? el = img : el );     
    })
    saveLastRect(coord.x, coord.y, (offsetX-coord.x), (offsetY-coord.y));  
  }

  return (       
    <div style={{margin: '0 auto'}}> 
      <div style={{margin: '0px auto', border: '1px solid grey', width: '800px'}}> 
      {console.log(fin, 'fin')}
       {pdfDocument && (
         [1,2,3,4].map((el, i) => {  
           console.log(i, 'i')
          return <MakeImg number={i+1} key={Math.random()*8} updateFin={updateFin} save={save}/>
          })
        )
       }
      </div>
      <canvas ref={canvasRef} width='744' height='1052' className='hidden'></canvas>     
      <nav style={{margin: '0 auto'}}>
            <ul className="pager" style={{display: 'flex', listStyle: 'none', justifyContent: 'center'}}> 
                <li className="next" style={{marginRight: '15px'}}>
                <button onClick={()=>setSave(true)}>
                Save
                </button>
                </li>
                <li className="next" >
                <button>
                  Cancel
                </button>                
                </li>
            </ul>
        </nav>
    </div>
  )      
}

export default Canvas;