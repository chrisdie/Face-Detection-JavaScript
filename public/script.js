const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

var lastExpression = ["neutral",1]

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  $("#videodiv").append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)



  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    //console.log("hello?1", resizedDetections)
    if (resizedDetections && resizedDetections[0] && resizedDetections[0].expressions){

      
      //console.log("hello?2.1", Object.entries(resizedDetections[0].expressions))
      var expressions = Object.entries(resizedDetections[0].expressions)
      //console.log("hello?2.2", expressions)
      const maxExpression = expressions.reduce(function(prev, current) {
          return (prev[1] > current[1]) ? prev : current
      })

      if (maxExpression[0] !== lastExpression[0]){
        console.log("new expression", maxExpression)
        $.ajax({
          'type': 'POST',
          'url': "/newdata",
          'crossDomain':true,
          'contentType': 'application/json',
          'data': JSON.stringify({visitorid, expression:maxExpression[0]}),
          'dataType': 'json'})
        lastExpression = maxExpression
      }
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})