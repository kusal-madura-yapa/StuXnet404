export const drawRect = (detections, ctx) =>{
    detections.forEach(predictions=>{
        // Get prediction results
        const [x,y,width,height] = predictions['bbox'];
        const text = predictions['class'];
        
        
        // Set styling

        // const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        const color = '#FF0000' 
        ctx.strokeStyle = color
        ctx.font = '18px Arial'
        ctx.fillStyle = color

        // Draw retangles and text
        ctx.beginPath()
        ctx.fillText(text, x, y)
        ctx.rect(x, y, width, height)
        ctx.stroke()
    })
}